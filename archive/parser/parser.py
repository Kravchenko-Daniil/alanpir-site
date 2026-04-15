import json
import re
import html
import os
from urllib.parse import urljoin, unquote, urlparse

import requests
from bs4 import BeautifulSoup

BASE = "https://nashpir.ru"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/129.0 Safari/537.36"
    )
}

# куда сохраняем картинки (папка создастся автоматически)
IMAGES_DIR = "images"

CATEGORY_URLS = [
    "https://nashpir.ru/osetinskie-pirogi/",
    "https://nashpir.ru/meat-pirog/",
    "https://nashpir.ru/chise/",
    "https://nashpir.ru/chiken/",
    "https://nashpir.ru/potato/",
    "https://nashpir.ru/fish/",
    "https://nashpir.ru/sladkie-pirogi/",
    "https://nashpir.ru/set/",
    "https://nashpir.ru/sous/",
    "https://nashpir.ru/drinks/",
]

session = requests.Session()
session.headers.update(HEADERS)


def get_soup(url: str) -> BeautifulSoup:
    resp = session.get(url, timeout=20)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def clean_text(text: str | None) -> str | None:
    if text is None:
        return None
    return " ".join(text.replace("\xa0", " ").split())


def extract_title(card: BeautifulSoup) -> str | None:
    h2 = card.find("h2", class_="woocommerce-loop-product__title")
    if not h2:
        return None
    return clean_text(h2.get_text(strip=True))


def extract_composition(card: BeautifulSoup) -> str | None:
    pre = card.find("pre")
    if not pre:
        return None
    text = clean_text(pre.get_text(" ", strip=True))
    if not text:
        return None
    m = re.search(r"Состав:\s*(.+)", text, flags=re.IGNORECASE)
    return m.group(1).strip() if m else text


def extract_card_image(card: BeautifulSoup) -> str | None:
    img = card.find("img")
    if not img:
        return None
    for attr in ("data-src", "data-lazy-src", "src"):
        if img.get(attr):
            return img[attr]
    return None


def extract_product_url(card: BeautifulSoup) -> str | None:
    a = card.find("a", href=lambda h: h and "/product/" in h)
    if not a:
        return None
    return urljoin(BASE, a["href"])


def extract_category_name(soup: BeautifulSoup) -> str | None:
    h1 = soup.find("h1")
    if h1:
        return clean_text(h1.get_text(strip=True))
    if soup.title:
        return clean_text(soup.title.get_text(strip=True))
    return None


def find_next_page(soup: BeautifulSoup) -> str | None:
    link = soup.select_one("a.next, a.next.page-numbers")
    if link and link.get("href"):
        return urljoin(BASE, link["href"])

    link_tag = soup.find("link", rel="next")
    if link_tag and link_tag.get("href"):
        return urljoin(BASE, link_tag["href"])

    return None


# ---------- работа с вариациями ----------

def parse_variants(card: BeautifulSoup):
    """
    Читаем data-product_variations и возвращаем:
    - список вариантов [{weight, weight_raw, price, price_text}, ...]
    - url картинки из вариаций (если есть)
    """
    form = card.find("form", class_=lambda c: c and "vi_wpvs_loop_variation_form" in c)
    if not form:
        return [], None

    data = form.get("data-product_variations")
    if not data:
        return [], None

    try:
        decoded = html.unescape(data)
        variations = json.loads(decoded)
    except Exception as e:
        print("Ошибка парсинга data-product_variations:", e)
        return [], None

    variants = []
    image_from_variants = None

    for v in variations:
        attrs = v.get("attributes", {})
        weight_raw_value = None
        for val in attrs.values():
            weight_raw_value = val
            break

        weight_raw_decoded = None
        weight_label = None
        if weight_raw_value:
            weight_raw_decoded = unquote(weight_raw_value)     # 700-%d0%b3 -> 700-г
            m = re.search(r"(\d+)", weight_raw_decoded)
            if m:
                weight_label = f"{m.group(1)} г"
            else:
                weight_label = weight_raw_decoded

        price_num = v.get("display_price") or v.get("display_regular_price")
        price_html = v.get("price_html")
        price_text = None

        if price_html:
            price_soup = BeautifulSoup(price_html, "html.parser")
            price_text = clean_text(price_soup.get_text(strip=True))
        elif price_num is not None:
            price_text = f"{price_num:.2f} ₽".replace(".", ",")

        img_info = v.get("image") or {}
        img_url = (
            img_info.get("full_src")
            or img_info.get("url")
            or img_info.get("src")
        )
        if img_url and not image_from_variants:
            image_from_variants = img_url

        variants.append(
            {
                "weight": weight_label,
                "weight_raw": weight_raw_decoded,
                "price": price_num,
                "price_text": price_text,
            }
        )

    return variants, image_from_variants


# ---------- скачивание картинок ----------

def slugify(text: str) -> str:
    """Простая функция для имени файла: убираем лишнее, пробелы -> '-'."""
    text = text.lower()
    # заменяем кавычки, длинные тире и прочий мусор
    text = re.sub(r"[\"“”«»„]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^a-z0-9а-яё\-]", "", text)
    return text.strip("-")


def download_image(image_url: str | None, title: str | None) -> str | None:
    """
    Скачиваем картинку в IMAGES_DIR, возвращаем относительный путь
    (например, 'images/osetinskii-pirog.jpg').
    Если не получилось — None.
    """
    if not image_url:
        return None

    try:
        parsed = urlparse(image_url)
        filename = os.path.basename(parsed.path)
        if not filename:
            # если вдруг в урле нет имени файла
            base = slugify(title or "image")
            filename = f"{base}.jpg"
        else:
            # подправим имя файла, чтобы не было странных символов
            name, ext = os.path.splitext(filename)
            filename = f"{slugify(name) or 'image'}{ext or '.jpg'}"

        os.makedirs(IMAGES_DIR, exist_ok=True)
        local_path = os.path.join(IMAGES_DIR, filename)

        # если уже скачивали — не трогаем
        if os.path.exists(local_path):
            return local_path

        print(f"  Скачиваю изображение: {image_url} -> {local_path}")
        resp = session.get(image_url, timeout=30)
        resp.raise_for_status()

        with open(local_path, "wb") as f:
            f.write(resp.content)

        return local_path
    except Exception as e:
        print(f"  Не удалось скачать изображение {image_url}: {e}")
        return None


# ---------- карточка товара ----------

def parse_product_card(card: BeautifulSoup, category_url: str, category_name: str | None) -> dict:
    title = extract_title(card)
    composition = extract_composition(card)
    product_url = extract_product_url(card)
    image_url = extract_card_image(card)

    variants, img_from_variants = parse_variants(card)
    if img_from_variants:
        image_url = img_from_variants

    # скачиваем картинку локально
    image_local_path = download_image(image_url, title)

    return {
        "category_url": category_url,
        "category_name": category_name,
        "title": title,
        "product_url": product_url,
        "composition": composition,
        "image_url": image_url,
        "image_local_path": image_local_path,
        "variants": variants,
    }


def parse_category(category_url: str) -> list[dict]:
    all_items: list[dict] = []
    url = category_url

    while url:
        print(f"Парсим категорию: {url}")
        soup = get_soup(url)
        category_name = extract_category_name(soup)

        product_cards = soup.select("li.product")
        if not product_cards:
            print("Не нашёл карточек на странице:", url)
            break

        for card in product_cards:
            item = parse_product_card(card, category_url, category_name)
            all_items.append(item)

        url = find_next_page(soup)

    return all_items


def main():
    all_data: list[dict] = []

    for url in CATEGORY_URLS:
        try:
            items = parse_category(url)
            all_data.extend(items)
        except Exception as e:
            print(f"Ошибка при парсинге {url}: {e}")

    # полный дамп
    with open("nashpir_menu_raw.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    # словари грамм → цена + локальный путь до картинки
    grams_prices_data = []
    for item in all_data:
        variants = item.get("variants") or []
        grams_prices = {
            v["weight"]: v["price"]
            for v in variants
            if v.get("weight") and v.get("price") is not None
        }

        grams_prices_data.append(
            {
                "category_name": item.get("category_name"),
                "category_url": item.get("category_url"),
                "title": item.get("title"),
                "composition": item.get("composition"),
                "product_url": item.get("product_url"),
                "image_url": item.get("image_url"),
                "image_local_path": item.get("image_local_path"),
                "grams_prices": grams_prices,
            }
        )

    with open("nashpir_grams_prices.json", "w", encoding="utf-8") as f:
        json.dump(grams_prices_data, f, ensure_ascii=False, indent=2)

    print(f"Готово. Спарсили {len(all_data)} карточек товаров.")
    print("Файлы: nashpir_menu_raw.json и nashpir_grams_prices.json")
    print(f"Картинки сохранены в папку: {IMAGES_DIR}/")


if __name__ == "__main__":
    main()
