const menuData = window.menuData || [];
let productData = [];

const promoCodes = {
  APP10: { type: 'percent', value: 10, description: 'Скидка 10% на мобильный заказ' },
  FREEDEL: { type: 'delivery', value: 390, description: 'Бесплатная доставка' },
  PIE300: { type: 'amount', value: 300, description: 'Минус 300 ₽ на корзину от 1500 ₽', minSum: 1500 }
};

const state = {
  filter: 'all',
  veganOnly: false,
  cart: [],
  promo: null
};

const STORAGE_KEY = 'pirogi_cart_v1';
const AUTH_USERS_KEY = 'pirogi_users_v1';
const AUTH_SESSION_KEY = 'pirogi_session_v1';
const API_BASE = (() => {
  const meta = document.querySelector('meta[name="api-base"]')?.content;
  if (meta) return meta;
  try {
    if (window.location && window.location.origin) {
      return window.location.origin + '/api';
    }
  } catch (_) {}
  return 'http://localhost:3000/api';
})();
const ADDR_KEY = 'pirogi_addresses_v1';

const dom = {
  grid: document.querySelector('#productGrid'),
  filterButtons: document.querySelectorAll('.filter-tabs button'),
  veganToggle: document.querySelector('[data-vegan-only]'),
  cartToggleButtons: document.querySelectorAll('[data-cart-toggle]'),
  cartPanel: document.querySelector('[data-cart-panel]'),
  cartBackdrop: document.querySelector('[data-cart-backdrop]'),
  cartItems: document.querySelector('[data-cart-items]'),
  cartCountEls: document.querySelectorAll('[data-cart-count]'),
  cartPromoInput: document.querySelector('[data-cart-promo]'),
  cartDiscount: document.querySelector('[data-cart-discount]'),
  cartDelivery: document.querySelector('[data-cart-delivery]'),
  cartTotal: document.querySelector('[data-cart-total]'),
  inlinePromoInput: document.querySelector('[data-inline-promo]'),
  applyInlinePromo: document.querySelector('[data-apply-inline-promo]'),
  applyPromoBtn: document.querySelector('[data-apply-promo]'),
  checkoutBtn: document.querySelector('[data-checkout]'),
  pointsRange: document.querySelector('[data-points-range]'),
  pointsSelected: document.querySelector('[data-points-selected]'),
  pointsBalance: document.querySelector('[data-points-balance]'),
  featuredButtons: document.querySelectorAll('[data-featured-add]')
};

// Toast notifications
function ensureToastContainer() {
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.append(c);
  }
  return c;
}
function showToast(message, type = 'info', duration = 2500) {
  const c = ensureToastContainer();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  c.append(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{
    t.classList.remove('show');
    setTimeout(()=> t.remove(), 200);
  }, duration);
}

// Простое модальное окно для карточки товара (сеты)
const productModal = {
  root: null,
  backdrop: null,
  dialog: null,
  content: null
};

function renderProducts() {
  if (!dom.grid) return;
  dom.grid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const filtered = productData.filter((product) => {
    const matchFilter = state.filter === 'all'
      ? product.category !== 'Сеты'
      : product.category === state.filter;
    const matchVegan = state.veganOnly ? product.isVegan : true;
    return matchFilter && matchVegan;
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'По выбранным фильтрам ничего не найдено.';
    empty.className = 'muted';
    dom.grid.append(empty);
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const categoryEl = document.createElement('div');
    categoryEl.className = 'product-card__category';
    categoryEl.textContent = product.category;

    const img = document.createElement('div');
    img.className = 'product-card__image';
    img.style.backgroundImage = `url("${product.image}")`;

    const title = document.createElement('h3');
    title.textContent = product.shortTitle || product.title;

    const desc = document.createElement('p');
    desc.className = 'muted';
    desc.textContent = product.description;

    const weights = document.createElement('div');
    weights.className = 'product-card__weights';

    const price = document.createElement('div');
    price.className = 'product-card__price';
    const footer = document.createElement('div');
    footer.className = 'product-card__footer';

    const actionBtn = document.createElement('button');
    actionBtn.className = 'btn btn--accent';
    actionBtn.textContent = 'Добавить';
    actionBtn.type = 'button';

    let selectedVariant = product.variants[0];
    if (!selectedVariant) {
      // Если нет вариантов — безопасный рендер без кнопки
      price.textContent = 'Нет в наличии';
      actionBtn.disabled = true;
    } else {
      price.textContent = `${selectedVariant.price.toLocaleString('ru-RU')} ₽`;
    }

    product.variants.forEach((variant, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `weight-chip${index === 0 ? ' active' : ''}`;
      chip.textContent = variant.label;
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedVariant = variant;
        weights.querySelectorAll('.weight-chip').forEach((btn) => btn.classList.remove('active'));
        chip.classList.add('active');
        price.textContent = `${variant.price.toLocaleString('ru-RU')} ₽`;
      });
      weights.append(chip);
    });

    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart({
        id: product.id,
        title: product.title,
        variant: selectedVariant.label,
        price: selectedVariant.price
      });
    });

    // Открывать модалку при клике по карточке, но только для категории «Сеты»
    if (product.category === 'Сеты') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openProductModal(product));
    }

    footer.append(price, actionBtn);
    card.append(categoryEl, img, title, desc, weights, footer);
    fragment.append(card);
  });

  dom.grid.append(fragment);
}

function addToCart(item) {
  const existing = state.cart.find(
    (cartItem) => cartItem.id === item.id && cartItem.variant === item.variant
  );

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...item, qty: 1 });
  }

  renderCart();
  saveCart();
}

function renderCart() {
  if (!dom.cartItems) return;
  dom.cartItems.innerHTML = '';
  const fragment = document.createDocumentFragment();
  let subtotal = 0;

  state.cart.forEach((item, index) => {
    subtotal += item.price * item.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';

    const product = productData.find((p) => p.id === item.id);
    const displayTitle = product?.shortTitle || product?.title || item.title;
    const imageUrl = product?.image || '';

    const media = document.createElement('div');
    media.className = 'cart-item__media';
    if (imageUrl) media.style.backgroundImage = `url("${imageUrl}")`;

    const info = document.createElement('div');
    info.className = 'cart-item__info';
    const name = document.createElement('div');
    name.className = 'cart-item__title';
    name.textContent = displayTitle;
    name.title = displayTitle;
    const meta = document.createElement('div');
    meta.className = 'cart-item__meta muted';
    meta.textContent = item.variant;
    info.append(name, meta);

    const controls = document.createElement('div');
    controls.className = 'cart-item__qty';

    const minus = document.createElement('button');
    minus.className = 'qty-btn qty-btn--minus';
    minus.textContent = '−';
    minus.addEventListener('click', () => updateQty(index, -1));

    const qty = document.createElement('span');
    qty.textContent = `${item.qty} шт.`;

    const plus = document.createElement('button');
    plus.className = 'qty-btn qty-btn--plus';
    plus.textContent = '+';
    plus.addEventListener('click', () => updateQty(index, 1));

    const total = document.createElement('strong');
    total.textContent = `${(item.price * item.qty).toLocaleString('ru-RU')} ₽`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'qty-btn qty-btn--remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => removeItem(index));

    controls.append(minus, qty, plus, total, removeBtn);
    li.append(media, info, controls);
    fragment.append(li);
  });

  if (!state.cart.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Корзина пустая — добавьте пирог из каталога.';
    empty.className = 'muted';
    dom.cartItems.append(empty);
  } else {
    dom.cartItems.append(fragment);
  }

  const totalQty = state.cart.reduce((acc, item) => acc + item.qty, 0);
  dom.cartCountEls.forEach((el) => (el.textContent = totalQty));

  const { discount, delivery, total } = calculateTotals(subtotal);
  if (dom.cartDiscount) dom.cartDiscount.textContent = `${discount.toLocaleString('ru-RU')} ₽`;
  if (dom.cartDelivery) dom.cartDelivery.textContent = `${delivery.toLocaleString('ru-RU')} ₽`;
  if (dom.cartTotal) dom.cartTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

function calculateTotals(subtotal) {
  let discount = 0;
  let delivery = subtotal >= 2500 ? 0 : 390;

  if (state.promo) {
    const promo = promoCodes[state.promo];
    if (promo) {
      if (promo.minSum && subtotal < promo.minSum) {
        // промо есть, но условия ещё не выполнены
      } else if (promo.type === 'percent') {
        discount = Math.round((subtotal * promo.value) / 100);
      } else if (promo.type === 'amount') {
        discount = promo.value;
      } else if (promo.type === 'delivery') {
        delivery = Math.max(0, delivery - promo.value);
      }
    }
  }

  const pointsToRedeem = Number(dom.pointsSelected?.textContent ?? 0);
  const maxRedeem = Math.round(subtotal * 0.3);
  const appliedPoints = Math.min(pointsToRedeem, maxRedeem);

  const total = Math.max(subtotal - discount - appliedPoints, 0) + delivery;
  return { discount: discount + appliedPoints, delivery, total };
}

function updateQty(index, delta) {
  const item = state.cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart.splice(index, 1);
  }
  renderCart();
  saveCart();
}

function removeItem(index) {
  state.cart.splice(index, 1);
  renderCart();
  saveCart();
}

function openCart() {
  dom.cartPanel?.classList.add('open');
  dom.cartPanel?.setAttribute('aria-hidden', 'false');
  dom.cartBackdrop?.classList.add('visible');
}

function closeCart() {
  dom.cartPanel?.classList.remove('open');
  dom.cartPanel?.setAttribute('aria-hidden', 'true');
  dom.cartBackdrop?.classList.remove('visible');
}

function bindEvents() {
  dom.veganToggle?.addEventListener('change', (event) => {
    state.veganOnly = event.target.checked;
    renderProducts();
  });

  dom.cartToggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = dom.cartPanel?.classList.contains('open');
      isOpen ? closeCart() : openCart();
    });
  });

  dom.cartBackdrop?.addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
      closeProductModal();
      closeAuthModal();
      closeAddressModal();
    }
  });

  dom.applyPromoBtn?.addEventListener('click', () => {
    const inputValue = dom.cartPromoInput?.value ?? '';
    const code = inputValue.trim().toUpperCase();
    applyPromo(code, true);
  });

  dom.applyInlinePromo?.addEventListener('click', () => {
    const inputValue = dom.inlinePromoInput?.value ?? '';
    const code = inputValue.trim().toUpperCase();
    applyPromo(code);
  });

  dom.checkoutBtn?.addEventListener('click', () => {
    if (!state.cart.length) {
      alert('Корзина пуста — добавьте пироги.');
      return;
    }
    // Перенаправляем на страницу оформления
    window.location.href = 'checkout.html';
  });

  dom.pointsRange?.addEventListener('input', (event) => {
    const max = Number(dom.pointsBalance?.textContent ?? 0);
    const value = Math.min(Number(event.target.value), max);
    if (dom.pointsSelected) {
      dom.pointsSelected.textContent = value;
    }
    renderCart();
  });

  dom.featuredButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.product;
      const product = productData.find((item) => item.id === productId);
      if (!product) return;
      const variant = product.variants[0];
      addToCart({
        id: product.id,
        title: product.title,
        variant: variant.label,
        price: variant.price
      });
    });
  });

  document.querySelectorAll('[data-section-link]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.sectionLink);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-auth-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => openAuthModal());
  });

  // no delivery panel form on current pages
}

function applyPromo(code, showAlert = false) {
  if (!code) {
    alert('Введите промокод.');
    return;
  }
  const promo = promoCodes[code];
  if (!promo) {
    alert('Такого промокода нет.');
    return;
  }
  state.promo = code;
  if (dom.cartPromoInput) dom.cartPromoInput.value = code;
  if (dom.inlinePromoInput) dom.inlinePromoInput.value = code;
  if (showAlert) {
    alert(`Промокод ${code} активирован.`);
  }
  renderCart();
  saveCart();
}

function saveCart() {
  try {
    const data = { cart: state.cart, promo: state.promo };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

function restoreCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.cart)) state.cart = data.cart;
    if (data.promo) state.promo = data.promo;
    if (dom.cartPromoInput && state.promo) dom.cartPromoInput.value = state.promo;
  } catch (_) {}
}

function getShortTitle(title = '') {
  // 1) Если есть кавычки — берём имя из них
  const curly = title.match(/“([^”]+)”/);
  if (curly && curly[1]) {
    return `Пирог “${curly[1]}”`;
  }
  const straight = title.match(/"([^"]+)"/);
  if (straight && straight[1]) {
    return `Пирог “${straight[1]}”`;
  }
  // 2) Сокращаем приставку «Осетинский пирог …» → «Пирог …»
  const replaced = title.replace(/^\s*Осетин(?:ск|ски|ский|ский)\s+пирог\s+/i, 'Пирог ');
  return replaced || title;
}

function formatSetDescription(text = '') {
  if (!text) return [];
  // Убираем префикс "Сет ...:"
  let t = text.replace(/Сет[^:]*:\s*/i, ' ').replace(/\s+/g, ' ').trim();
  if (!t) return [];
  // Помечаем границы элементов перед ключевыми словами
  t = t
    .replace(/\s+(Осетинск[ИЙий]\s+пирог)/gi, '|$1')
    .replace(/\s+(Пирог)/g, '|$1');
  const parts = t.split('|').map((s) => s.trim()).filter(Boolean);
  // Нормализуем регистр первого слова
  return parts.map((s) => s.replace(/^осетинск[ийй]\s+пирог/i, 'Осетинский пирог'));
}

function loadProducts() {
  productData = menuData.map((item, index) => {
    const variants = Object.entries(item.grams_prices || {}).map(([label, price]) => ({
      label,
      price: Number(price)
    }));

    return {
      id: item.product_url || `item-${index}`,
      category: item.category_name || 'Каталог',
      title: item.title,
      shortTitle: getShortTitle(item.title || ''),
      description: item.composition || '',
      isVegan: false,
      flags: Array.isArray(item.flags) ? item.flags : [],
      image: item.image_local_path ? `data/${item.image_local_path}` : item.image_url,
      variants
    };
  });

  // Настраиваем цены для раздела «Сеты» согласно макету
  const setPriceMap = [
    { re: /НАШ\s*ПИР|Наш\s*Пир/i, label: '10 кг', price: 12666 },
    { re: /Ассорти.*7\s*кг/i, label: '7 кг', price: 8946 },
    { re: /Выгодн.*(1[\.,]8\s*кг)/i, label: '1.8 кг', price: 2484 },
    { re: /Тройка.*3\s*кг/i, label: '3 кг', price: 3629 },
    { re: /Офисн.*5\s*кг/i, label: '5 кг', price: 5952 }
  ];

  productData.forEach((p) => {
    if (p.category === 'Сеты') {
      const found = setPriceMap.find((s) => s.re.test(p.title));
      if (found) {
        p.variants = [{ label: found.label || 'Комплект', price: found.price }];
      }
    }
  });

  const categories = [...new Set(productData.map((p) => p.category))];
  buildFilterTabs(categories);
  renderProducts();
}

function buildFilterTabs(categories = []) {
  const tabs = document.querySelector('.filter-tabs');
  if (!tabs) return;
  tabs.innerHTML = '';

  const makeButton = (label, value, active = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.dataset.filter = value;
    if (active) btn.classList.add('active');
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = value;
      renderProducts();
    });
    return btn;
  };

  tabs.append(makeButton('Все', 'all', true));
  categories.forEach((cat) => tabs.append(makeButton(cat, cat)));
}

function buildProductModal() {
  // Создаем модальное окно один раз
  const root = document.createElement('div');
  root.className = 'modal';
  root.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal__backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'modal__dialog';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal__close modal__close--icon btn';
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Закрыть');

  const content = document.createElement('div');
  content.className = 'modal__content auth-content';

  dialog.append(closeBtn, content);
  root.append(backdrop, dialog);
  document.body.append(root);

  backdrop.addEventListener('click', closeProductModal);
  closeBtn.addEventListener('click', closeProductModal);

  productModal.root = root;
  productModal.backdrop = backdrop;
  productModal.dialog = dialog;
  productModal.content = content;
}

function openProductModal(product) {
  if (!productModal.root) buildProductModal();
  const { content, root } = productModal;
  content.innerHTML = '';

  // Лэйаут большой карточки
  const wrapper = document.createElement('div');
  wrapper.className = 'modal-card';

  const img = document.createElement('div');
  img.className = 'modal-card__image';
  img.style.backgroundImage = `url("${product.image}")`;

  const body = document.createElement('div');
  body.className = 'modal-card__body';

  const category = document.createElement('div');
  category.className = 'product-card__category';
  category.textContent = product.category;

  const title = document.createElement('h3');
  title.textContent = product.shortTitle || product.title;

  const desc = document.createElement('p');
  desc.className = 'muted';
  desc.textContent = product.description || '';

  const weights = document.createElement('div');
  weights.className = 'product-card__weights';

  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const price = document.createElement('div');
  price.className = 'product-card__price';

  let selectedVariant = product.variants[0];
  if (!selectedVariant) {
    price.textContent = 'Нет в наличии';
  } else {
    price.textContent = `${selectedVariant.price.toLocaleString('ru-RU')} ₽`;
  }

  product.variants.forEach((variant, index) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `weight-chip${index === 0 ? ' active' : ''}`;
    chip.textContent = variant.label;
    chip.addEventListener('click', () => {
      selectedVariant = variant;
      weights.querySelectorAll('.weight-chip').forEach((btn) => btn.classList.remove('active'));
      chip.classList.add('active');
      price.textContent = `${variant.price.toLocaleString('ru-RU')} ₽`;
    });
    weights.append(chip);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn--accent';
  addBtn.textContent = 'Добавить';
  addBtn.addEventListener('click', () => {
    if (!selectedVariant) return;
    addToCart({ id: product.id, title: product.title, variant: selectedVariant.label, price: selectedVariant.price });
    closeProductModal();
  });

  footer.append(price, addBtn);
  // Для сетов — разворачиваем состав в список, по одному пирогу на строку
  if (product.category === 'Сеты' && product.description) {
    const items = formatSetDescription(product.description);
    if (items.length) {
      const list = document.createElement('div');
      list.className = 'set-list';
      const heading = document.createElement('p');
      heading.className = 'muted';
      heading.textContent = 'Состав:';
      items.forEach((txt) => {
        const row = document.createElement('div');
        row.textContent = txt;
        list.append(row);
      });
      body.append(category, title, heading, list, weights, footer);
    } else {
      body.append(category, title, desc, weights, footer);
    }
  } else {
    body.append(category, title, desc, weights, footer);
  }
  wrapper.append(img, body);
  content.append(wrapper);

  root.classList.add('open');
  root.setAttribute('aria-hidden', 'false');
}

function closeProductModal() {
  if (!productModal.root) return;
  productModal.root.classList.remove('open');
  productModal.root.setAttribute('aria-hidden', 'true');
}

// ====== Auth modal ======
const authModal = { root: null, backdrop: null, dialog: null, content: null };

// ====== Checkout modal ======
const checkoutModal = { root: null, backdrop: null, dialog: null, content: null };
// ====== Address modal ======
const addressModal = { root: null, backdrop: null, dialog: null, content: null, onSave: null };

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveUsers(users) {
  try { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users)); } catch (_) {}
}

function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (raw) return JSON.parse(raw);
    // Fallback: из cookie, если localStorage пуст
    const c = getCookie('alanpir_session');
    return c ? { phone: c } : null;
  } catch (_) { return null; }
}

function setSession(session) {
  try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session)); } catch (_) {}
  if (session?.phone) setCookie('alanpir_session', session.phone, 180);
}

function clearSession() {
  try { localStorage.removeItem(AUTH_SESSION_KEY); } catch (_) {}
  deleteCookie('alanpir_session');
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback (небезопасно, только для dev)
  return btoa(password);
}

function normalizePhone(input) {
  const digits = String(input || '').replace(/\D+/g, '');
  if (!digits) return '';
  let num = digits;
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) {
    num = '7' + digits.slice(1);
  } else if (digits.length === 10) {
    num = '7' + digits;
  }
  return '+' + num;
}

// ---- Cookies helpers ----
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
function setCookie(name, value, days = 180) {
  const maxAge = Math.floor(days * 86400);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}
function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function buildAuthModal() {
  if (authModal.root) return;
  const root = document.createElement('div');
  root.className = 'modal';
  root.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal__backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'modal__dialog';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal__close btn';
  closeBtn.type = 'button';
  closeBtn.textContent = 'Закрыть';

  const content = document.createElement('div');
  content.className = 'modal__content';

  const title = document.createElement('h3');
  title.textContent = 'Вход или регистрация';

  const form = document.createElement('form');
  form.className = 'info-grid';
  form.style.gap = '12px';
  form.style.gridTemplateColumns = '1fr';

  const emailLabel = document.createElement('label');
  emailLabel.innerHTML = '<span class="muted">E-mail</span>';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'you@example.com';
  emailInput.required = true;
  emailInput.style.padding = '12px';
  emailInput.style.borderRadius = 'var(--radius)';
  emailInput.style.border = '1px solid var(--line)';
  emailLabel.append(emailInput);

  const phoneLabel = document.createElement('label');
  phoneLabel.innerHTML = '<span class="muted">Телефон</span>';
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.placeholder = '+7 (999) 123-45-67';
  phoneInput.style.padding = '12px';
  phoneInput.style.borderRadius = 'var(--radius)';
  phoneInput.style.border = '1px solid var(--line)';
  phoneLabel.append(phoneInput);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn--accent';
  submit.textContent = 'Продолжить';

  form.append(emailLabel, phoneLabel, submit);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Мы отправили ссылку для входа на e-mail.');
    closeAuthModal();
  });

  content.append(title, form);
  dialog.append(closeBtn, content);
  root.append(backdrop, dialog);
  document.body.append(root);

  backdrop.addEventListener('click', closeAuthModal);
  closeBtn.addEventListener('click', closeAuthModal);

  authModal.root = root;
  authModal.backdrop = backdrop;
  authModal.dialog = dialog;
  authModal.content = content;
}

function openAuthModal() {
  if (!authModal.root) buildAuthModal();
  renderAuthModal();
  authModal.root.classList.add('open');
  authModal.root.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
  if (!authModal.root) return;
  authModal.root.classList.remove('open');
  authModal.root.setAttribute('aria-hidden', 'true');
}

function renderAuthModal() {
  const content = authModal.content;
  if (!content) return;
  content.innerHTML = '';

  const session = getSession();
  if (session?.phone) {
    const title = document.createElement('h3');
    title.textContent = 'Личный кабинет';
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = `Вы вошли как ${session.phone}`;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Выйти';
    btn.addEventListener('click', () => {
      clearSession();
      updateAuthButtons();
      closeAuthModal();
    });
    content.append(title, p, btn);
    return;
  }

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'filter-tabs';
  const tabLogin = document.createElement('button');
  tabLogin.textContent = 'Вход';
  tabLogin.classList.add('active');
  const tabReg = document.createElement('button');
  tabReg.textContent = 'Регистрация';
  tabs.append(tabLogin, tabReg);

  const pane = document.createElement('div');
  pane.className = 'auth-pane';

  async function apiLogin(phone, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'LOGIN_FAILED');
    return data;
  }

  async function apiRegister(phone, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'REGISTER_FAILED');
    return data;
  }

  function renderLogin() {
    pane.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'info-grid';
    form.style.gap = '12px';
    form.style.gridTemplateColumns = '1fr';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = '+7 (999) 123-45-67';
    phoneInput.required = true;
    phoneInput.style.padding = '12px';
    phoneInput.style.borderRadius = 'var(--radius)';
    phoneInput.style.border = '1px solid var(--line)';
    phoneInput.style.width = '100%';

    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.placeholder = 'Пароль';
    passInput.required = true;
    passInput.style.padding = '12px';
    passInput.style.borderRadius = 'var(--radius)';
    passInput.style.border = '1px solid var(--line)';
    passInput.style.width = '100%';

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn btn--accent';
    submit.textContent = 'Войти';

    form.append(phoneInput, passInput, submit);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = normalizePhone(phoneInput.value);
      try {
        await apiLogin(phone, passInput.value);
        setSession({ phone });
        updateAuthButtons();
        closeAuthModal();
      } catch (err) {
        alert('Ошибка входа. Убедитесь, что сервер авторизации запущен и данные корректны.');
      }
    });
    pane.append(form);
  }

  function renderRegister() {
    pane.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'info-grid';
    form.style.gap = '12px';
    form.style.gridTemplateColumns = '1fr';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = '+7 (999) 123-45-67';
    phoneInput.required = true;
    phoneInput.style.padding = '12px';
    phoneInput.style.borderRadius = 'var(--radius)';
    phoneInput.style.border = '1px solid var(--line)';
    phoneInput.style.width = '100%';

    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.placeholder = 'Пароль (мин. 6 символов)';
    passInput.required = true;
    passInput.minLength = 6;
    passInput.style.padding = '12px';
    passInput.style.borderRadius = 'var(--radius)';
    passInput.style.border = '1px solid var(--line)';
    passInput.style.width = '100%';

    const confirmInput = document.createElement('input');
    confirmInput.type = 'password';
    confirmInput.placeholder = 'Повторите пароль';
    confirmInput.required = true;
    confirmInput.style.padding = '12px';
    confirmInput.style.borderRadius = 'var(--radius)';
    confirmInput.style.border = '1px solid var(--line)';
    confirmInput.style.width = '100%';

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn btn--accent';
    submit.textContent = 'Зарегистрироваться';

    form.append(phoneInput, passInput, confirmInput, submit);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = normalizePhone(phoneInput.value);
      const pwd = passInput.value;
      const pwd2 = confirmInput.value;
      if (!/^\+7\d{10}$/.test(phone)) {
        alert('Введите телефон в формате +7XXXXXXXXXX');
        return;
      }
      if (pwd.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
      }
      if (pwd !== pwd2) {
        alert('Пароли не совпадают');
        return;
      }
      try {
        await apiRegister(phone, pwd);
        // После регистрации — логин
        await apiLogin(phone, pwd);
        setSession({ phone });
        updateAuthButtons();
        closeAuthModal();
      } catch (err) {
        alert('Ошибка регистрации. Возможно, номер уже зарегистрирован или сервер не запущен.');
      }
    });
    pane.append(form);
  }

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
    renderLogin();
  });
  tabReg.addEventListener('click', () => {
    tabReg.classList.add('active');
    tabLogin.classList.remove('active');
    renderRegister();
  });

  content.append(tabs, pane);
  renderLogin();
}

function updateAuthButtons() {
  const session = getSession();
  document.querySelectorAll('[data-auth-trigger]').forEach((btn) => {
    if (session?.phone) {
      btn.textContent = 'Кабинет';
    } else {
      btn.textContent = 'Личный кабинет';
    }
  });
}

function init() {
  bindEvents();
  loadProducts();
  restoreCart();
  renderCart();
  buildProductModal();
  buildAuthModal();
  updateAuthButtons();
  buildCheckoutModal();
  if (document.querySelector('[data-checkout-page]')) {
    renderCheckoutPage();
  }
  if (window.location.pathname.endsWith('order.html')) {
    renderOrderPage();
  }
  if (window.location.pathname.endsWith('account.html')) {
    renderAccountOrders();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function buildCheckoutModal() {
  const root = document.createElement('div');
  root.className = 'modal';
  root.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal__backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'modal__dialog';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal__close modal__close--icon btn';
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Закрыть');

  const content = document.createElement('div');
  content.className = 'modal__content';

  dialog.append(closeBtn, content);
  root.append(backdrop, dialog);
  document.body.append(root);

  backdrop.addEventListener('click', closeCheckoutModal);
  closeBtn.addEventListener('click', closeCheckoutModal);

  checkoutModal.root = root;
  checkoutModal.backdrop = backdrop;
  checkoutModal.dialog = dialog;
  checkoutModal.content = content;
}

function openCheckoutModal() {
  if (!checkoutModal.root) buildCheckoutModal();
  renderCheckoutModal();
  checkoutModal.root.classList.add('open');
  checkoutModal.root.setAttribute('aria-hidden', 'false');
}

function closeCheckoutModal() {
  if (!checkoutModal.root) return;
  checkoutModal.root.classList.remove('open');
  checkoutModal.root.setAttribute('aria-hidden', 'true');
}

function renderCheckoutModal() {
  const content = checkoutModal.content;
  content.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = 'Оформление заказа';

  const grid = document.createElement('div');
  grid.className = 'checkout-grid';

  // Form
  const form = document.createElement('form');
  form.className = 'info-grid';
  form.style.gridTemplateColumns = '1fr';
  form.style.gap = '12px';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Имя';
  nameInput.style.padding = '12px';
  nameInput.style.border = '1px solid var(--line)';
  nameInput.style.borderRadius = 'var(--radius)';

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.placeholder = '+7 (999) 123-45-67';
  phoneInput.style.padding = '12px';
  phoneInput.style.border = '1px solid var(--line)';
  phoneInput.style.borderRadius = 'var(--radius)';
  phoneInput.value = getSession()?.phone ?? '';

  const addressInput = document.createElement('input');
  addressInput.type = 'text';
  addressInput.placeholder = 'Адрес доставки';
  addressInput.style.padding = '12px';
  addressInput.style.border = '1px solid var(--line)';
  addressInput.style.borderRadius = 'var(--radius)';

  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.style.padding = '12px';
  timeInput.style.border = '1px solid var(--line)';
  timeInput.style.borderRadius = 'var(--radius)';
  timeInput.title = 'Время доставки (по желанию)';

  const commentInput = document.createElement('input');
  commentInput.type = 'text';
  commentInput.placeholder = 'Комментарий для курьера (этаж, подъезд, код)';
  commentInput.style.padding = '12px';
  commentInput.style.border = '1px solid var(--line)';
  commentInput.style.borderRadius = 'var(--radius)';

  const payRow = document.createElement('div');
  payRow.className = 'filter-tabs';
  const payCash = document.createElement('button'); payCash.type='button'; payCash.textContent='Наличные';
  const payCard = document.createElement('button'); payCard.type='button'; payCard.textContent='Картой курьеру'; payCard.classList.add('active');
  const payOnline = document.createElement('button'); payOnline.type='button'; payOnline.textContent='Онлайн (скоро)';
  let paymentMethod = 'card_courier';
  ;[payCash, payCard, payOnline].forEach((btn) => btn.addEventListener('click', () => {
    payRow.querySelectorAll('button').forEach((b)=>b.classList.remove('active'));
    btn.classList.add('active');
    paymentMethod = btn===payCash?'cash':btn===payCard?'card_courier':'online';
  }));
  payRow.append(payCash, payCard, payOnline);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn--accent';
  submit.textContent = 'Подтвердить заказ';

  form.append(nameInput, phoneInput, addressInput, timeInput, commentInput, payRow, submit);

  // Summary
  const summary = document.createElement('div');
  summary.className = 'checkout-summary';

  const itemsCount = state.cart.reduce((a,i)=>a+i.qty,0);
  const subtotal = state.cart.reduce((a,i)=>a+i.qty*i.price,0);
  const totals = calculateTotals(subtotal);
  summary.innerHTML = `
    <div class="cart-summary__row"><span>Товары</span><strong>${itemsCount} шт.</strong></div>
    <div class="cart-summary__row"><span>Сумма</span><strong>${subtotal.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row"><span>Скидка</span><strong>${totals.discount.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row"><span>Доставка</span><strong>${totals.delivery.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row total"><span>Итого</span><strong>${totals.total.toLocaleString('ru-RU')} ₽</strong></div>
  `;

  grid.append(form, summary);
  content.append(title, grid);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.cart.length) return;
    try {
      const payload = {
        phone: normalizePhone(phoneInput.value),
        name: nameInput.value,
        address: addressInput.value,
        deliveryTime: timeInput.value || null,
        paymentMethod: paymentMethod,
        items: state.cart,
        promo: state.promo,
        subtotal,
        discount: totals.discount,
        delivery: totals.delivery,
        total: totals.total
      };
      const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error||'ORDER_FAILED');
      showToast(`Заказ №${data.orderId} создан. Мы скоро свяжемся!`, 'success');
      state.cart = [];
      renderCart();
      saveCart();
      closeCheckoutModal();
      setTimeout(()=>{ try{ window.location.href = 'index.html'; }catch(_){ } }, 1200);
    } catch(err) {
      showToast('Не удалось оформить заказ. Проверьте подключение сервера.', 'error');
    }
  });
}

// ===== Address modal (add address) =====
function buildAddressModal() {
  if (addressModal.root) return;
  const root = document.createElement('div'); root.className='modal'; root.setAttribute('aria-hidden','true');
  const backdrop = document.createElement('div'); backdrop.className='modal__backdrop';
  const dialog = document.createElement('div'); dialog.className='modal__dialog';
  const closeBtn = document.createElement('button'); closeBtn.className='modal__close modal__close--icon btn'; closeBtn.type='button'; closeBtn.textContent='×'; closeBtn.setAttribute('aria-label','Закрыть');
  const content = document.createElement('div'); content.className='modal__content';
  dialog.append(closeBtn, content); root.append(backdrop, dialog); document.body.append(root);
  backdrop.addEventListener('click', closeAddressModal); closeBtn.addEventListener('click', closeAddressModal);
  addressModal.root=root; addressModal.backdrop=backdrop; addressModal.dialog=dialog; addressModal.content=content;
}

function openAddressModal(onSave) {
  if (!addressModal.root) buildAddressModal();
  addressModal.onSave = onSave;
  renderAddressModal();
  addressModal.root.classList.add('open');
  addressModal.root.setAttribute('aria-hidden','false');
}

function closeAddressModal() {
  if (!addressModal.root) return; addressModal.root.classList.remove('open'); addressModal.root.setAttribute('aria-hidden','true');
}

function renderAddressModal() {
  const content = addressModal.content; content.innerHTML='';
  const title = document.createElement('h3'); title.textContent='Добавить адрес';
  const wrap = document.createElement('div'); wrap.className='info-grid'; wrap.style.gridTemplateColumns='1fr'; wrap.style.gap='10px';

  const streetWrap = document.createElement('div'); streetWrap.className='suggest-wrap';
  const streetInput = document.createElement('input'); streetInput.type='text'; streetInput.placeholder='Улица (г Москва)'; streetInput.style.padding='12px'; streetInput.style.border='1px solid var(--line)'; streetInput.style.borderRadius='var(--radius)'; streetInput.style.width='100%';
  const listStreet = document.createElement('div'); listStreet.className='suggest-list'; listStreet.style.display='none';
  streetWrap.append(streetInput, listStreet);

  const houseWrap = document.createElement('div'); houseWrap.className='suggest-wrap';
  const houseInput = document.createElement('input'); houseInput.type='text'; houseInput.placeholder='Дом'; houseInput.style.padding='12px'; houseInput.style.border='1px solid var(--line)'; houseInput.style.borderRadius='var(--radius)';
  const listHouse = document.createElement('div'); listHouse.className='suggest-list'; listHouse.style.display='none';
  houseWrap.append(houseInput, listHouse);
  const aptInput = document.createElement('input'); aptInput.type='text'; aptInput.placeholder='Квартира'; aptInput.style.padding='12px'; aptInput.style.border='1px solid var(--line)'; aptInput.style.borderRadius='var(--radius)';
  const entranceInput = document.createElement('input'); entranceInput.type='text'; entranceInput.placeholder='Подъезд'; entranceInput.style.padding='12px'; entranceInput.style.border='1px solid var(--line)'; entranceInput.style.borderRadius='var(--radius)';
  const floorInput = document.createElement('input'); floorInput.type='text'; floorInput.placeholder='Этаж'; floorInput.style.padding='12px'; floorInput.style.border='1px solid var(--line)'; floorInput.style.borderRadius='var(--radius)';
  const codeInput = document.createElement('input'); codeInput.type='text'; codeInput.placeholder='Код домофона'; codeInput.style.padding='12px'; codeInput.style.border='1px solid var(--line)'; codeInput.style.borderRadius='var(--radius)';

  const saveBtn = document.createElement('button'); saveBtn.className='btn btn--accent'; saveBtn.textContent='Сохранить адрес';

  let suggestTimer = null;
  let chosenStreet = null; // выбранная улица
  let chosenHouse = null;  // выбранный дом
  let isPickingModal = false;
  let DADATA_TOKEN_CACHE = null;
  async function getDaDataToken() {
    if (DADATA_TOKEN_CACHE !== null) return DADATA_TOKEN_CACHE;
    // 1) meta-тег на странице (для быстрых тестов)
    let meta = document.querySelector('meta[name="dadata-token"]')?.content?.trim();
    if (meta && !/^PUT_YOUR_/i.test(meta)) { DADATA_TOKEN_CACHE = meta; console.info('[DaData] token from meta'); return DADATA_TOKEN_CACHE; }
    // 2) получать с сервера из /api/config
    const tryFetch = async (base) => {
      try {
        const r = await fetch(`${base}/config`);
        if (!r.ok) return '';
        const data = await r.json().catch(()=>({}));
        return (data && data.dadataPublicToken) || '';
      } catch { return ''; }
    };
    let token = await tryFetch(API_BASE);
    // 3) fallback для локалки без прокси
    if (!token) token = await tryFetch('http://localhost:3000/api');
    DADATA_TOKEN_CACHE = token || '';
    if (DADATA_TOKEN_CACHE) console.info('[DaData] token from /api/config'); else console.warn('[DaData] public token not provided');
    return DADATA_TOKEN_CACHE;
  }

  async function updateStreet(){
    const q = streetInput.value.trim();
    if (suggestTimer) clearTimeout(suggestTimer);
    suggestTimer = setTimeout(async () => {
      chosenStreet = null; chosenHouse = null;
      if (q.length < 2) { listStreet.style.display='none'; listStreet.innerHTML=''; return; }
      try {
        const directToken = await getDaDataToken();
        let items = [];
        if (directToken) {
          console.info('[DaData] using direct client request');
          const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
          const body = {
            query: q,
            count: 10,
            locations: [{ kladr_id: '7700000000000' }],
            from_bound: { value: 'street' },
            to_bound: { value: 'street' },
            restrict_value: true
          };
          const r = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Token ${directToken}`
            },
            body: JSON.stringify(body)
          });
          const data = await r.json().catch(()=>({}));
          items = (data?.suggestions || []).map(s=> ({
            text: s?.data?.street_with_type || s?.data?.street || s?.value,
            street: s?.data?.street_with_type || s?.data?.street || '',
            house: '',
            data: s?.data || null
          })).filter(it => it.text);
        } else {
          console.info('[DaData] using server proxy');
          // 1) пытаться по относительному API_BASE (например, /api)
          let data = null;
          try {
            const r1 = await fetch(`${API_BASE}/suggest/address?query=${encodeURIComponent(q)}`);
            data = await r1.json().catch(()=>({}));
          } catch (_) { data = null; }
          let list1 = (data?.suggestions || []).map(s=> ({
            text: s.street || s.value,
            street: s.street || '',
            house: '',
            data: s.data || null
          })).filter(it => it.text);
          if (list1.length) {
            items = list1;
          } else {
            // 2) fallback на http://localhost:3000/api для локальной разработки без прокси
            try {
              const r2 = await fetch(`http://localhost:3000/api/suggest/address?query=${encodeURIComponent(q)}`);
              const data2 = await r2.json().catch(()=>({}));
              items = (data2?.suggestions || []).map(s=> ({
                text: s.street || s.value,
                street: s.street || '',
                house: '',
                data: s.data || null
              })).filter(it => it.text);
            } catch (_) { items = []; }
          }
        }
        // если сервер вернул пусто (например, без токена) — пробуем локальные заготовки
        if (!items.length) {
          const saved = loadAddresses()
            .map(a => a.street || '')
            .filter(Boolean)
            .filter(s => s.toLowerCase().includes(q.toLowerCase()));
          items = Array.from(new Set(saved)).slice(0, 8).map(text => ({ text, street: '', house: '', data: null }));
        }
        listStreet.innerHTML='';
        if (!items.length) { listStreet.style.display='none'; return; }
        items.forEach(s=>{
          const it=document.createElement('div');
          it.className='suggest-item';
          it.textContent=s.text;
          const pick = (e)=>{
            e.preventDefault(); e.stopPropagation();
            isPickingModal = true;
            chosenStreet = s;
            streetInput.value = s.street || s.text;
            listStreet.style.display='none';
            houseInput.focus();
            setTimeout(()=>{ isPickingModal=false; }, 0);
          };
          it.addEventListener('pointerdown', pick);
          it.addEventListener('mousedown', pick);
          it.addEventListener('touchstart', pick, { passive:false });
          listStreet.append(it);
        });
        listStreet.style.display='block';
      } catch (_) {
        listStreet.style.display='none';
      }
    }, 250);
  }
  streetInput.addEventListener('input', updateStreet);
  streetInput.addEventListener('blur', ()=> setTimeout(()=>{ if (!isPickingModal) listStreet.style.display='none'; }, 120));

  async function updateHouseSuggest() {
    const qHouse = houseInput.value.trim();
    if (!chosenStreet?.street || qHouse.length === 0) { listHouse.style.display='none'; listHouse.innerHTML=''; return; }
    try {
      const directToken = await getDaDataToken();
      let items = [];
      const query = `${chosenStreet.street} ${qHouse}`;
      if (directToken) {
        const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        const body = {
          query,
          count: 10,
          locations: [{ kladr_id: '7700000000000' }],
          from_bound: { value: 'house' },
          to_bound: { value: 'house' },
          restrict_value: true
        };
        const r = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Token ${directToken}`
          },
          body: JSON.stringify(body)
        });
        const data = await r.json().catch(()=>({}));
        items = (data?.suggestions || []).map(s=> ({
          text: s?.value,
          street: s?.data?.street_with_type || s?.data?.street || '',
          house: houseLabelFromData(s?.data) || s?.data?.house || '',
          data: s?.data || null
        })).filter(it => it.text && (it.house || (it.data && (it.data.house || it.data.block || it.data.building))));
      } else {
        // через сервер
        let data = null;
        try {
          const r1 = await fetch(`${API_BASE}/suggest/address?query=${encodeURIComponent(query)}`);
          data = await r1.json().catch(()=>({}));
        } catch (_) { data = null; }
        let list1 = (data?.suggestions || []).map(s=> ({
          text: s.value || s.street,
          street: s.street || '',
          house: houseLabelFromData(s.data) || s.house || '',
          data: s.data || null
        })).filter(it => it.text && (it.house || (it.data && (it.data.house || it.data.block || it.data.building))));
        items = list1;
      }
      listHouse.innerHTML='';
      if (!items.length) { listHouse.style.display='none'; return; }
      items.forEach(s=>{
        const it=document.createElement('div');
        it.className='suggest-item';
        it.textContent=s.text;
        const pick = (e)=>{
          e.preventDefault(); e.stopPropagation();
          isPickingModal = true;
          chosenHouse = s;
          if (s.house) houseInput.value = s.house;
          listHouse.style.display='none';
          setTimeout(()=>{ isPickingModal=false; }, 0);
        };
        it.addEventListener('pointerdown', pick);
        it.addEventListener('mousedown', pick);
        it.addEventListener('touchstart', pick, { passive:false });
        listHouse.append(it);
      });
      listHouse.style.display='block';
    } catch (_) {
      listHouse.style.display='none';
    }
  }
  houseInput.addEventListener('input', updateHouseSuggest);
  saveBtn.addEventListener('click', async ()=>{
    const selStreet = (chosenStreet?.street || '').trim();
    const selHouse = (chosenHouse?.house || '').trim();
    const addr={ street: selStreet, house: selHouse, apt: aptInput.value.trim(), entrance: entranceInput.value.trim(), floor: floorInput.value.trim(), code: codeInput.value.trim() };
    // Требуем выбор из подсказок (street + house)
    if(!selStreet || !selHouse){ alert('Выберите улицу и дом из подсказок'); return; }
    // Validate via server (with DaData if configured)
    try {
      saveBtn.disabled = true; saveBtn.textContent = 'Проверяем…';
      const res = await fetch(`${API_BASE}/validate/address`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ street: addr.street, house: addr.house, apt: addr.apt }) });
      const data = await res.json().catch(()=>({}));
      if (!res.ok || !data.ok) {
        const reason = data.error || 'ADDRESS_INVALID';
        alert(`Адрес не прошёл проверку (${reason}). Проверьте правильность.`);
        return;
      }
      // Optionally set a pretty name from normalized string
      addr.line = data.address || `${selStreet}, ${selHouse}`;
      addressModal.onSave && addressModal.onSave(addr);
      closeAddressModal();
    } catch (_) {
      alert('Не удалось проверить адрес. Проверьте подключение сервера.');
    } finally {
      saveBtn.disabled = false; saveBtn.textContent = 'Сохранить адрес';
    }
  });

  // Order fields in modal: Подъезд, Этаж, Кв., Код домофона
  wrap.append(streetWrap, houseWrap, entranceInput, floorInput, aptInput, codeInput, saveBtn);
  content.append(title, wrap);
}

function getCurrentUserKey() {
  const phone = getSession()?.phone;
  return phone || 'guest';
}

function loadAddresses() {
  try {
    const raw = localStorage.getItem(ADDR_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data; // старый формат
    const key = getCurrentUserKey();
    return Array.isArray(data[key]) ? data[key] : [];
  } catch(_) { return []; }
}

function saveAddresses(list) {
  try {
    const raw = localStorage.getItem(ADDR_KEY);
    const key = getCurrentUserKey();
    let data = {};
    if (raw) {
      try { data = JSON.parse(raw) || {}; } catch { data = {}; }
    }
    data[key] = list;
    localStorage.setItem(ADDR_KEY, JSON.stringify(data));
  } catch(_){}
}

function formatAddress(addr = {}) {
  if (addr.line) return `${addr.line}${addr.note ? ' — ' + addr.note : ''}`;
  const parts = [];
  if (addr.street) {
    let base = addr.street;
    if (addr.house) base += `, дом ${addr.house}`;
    parts.push(base);
  }
  if (addr.apt) parts.push(`кв. ${addr.apt}`);
  if (addr.entrance) parts.push(`подъезд ${addr.entrance}`);
  if (addr.floor) parts.push(`этаж ${addr.floor}`);
  if (addr.code) parts.push(`домофон ${addr.code}`);
  return parts.join(', ');
}

function renderCheckoutPage() {
  const formArea = document.querySelector('#checkoutFormArea');
  const summaryArea = document.querySelector('#checkoutSummaryArea');
  if (!formArea || !summaryArea) return;
  formArea.innerHTML='';
  summaryArea.innerHTML='';

  // Формы
  const h = document.createElement('h3'); h.textContent = 'Данные доставки';
  const nameInput = document.createElement('input');
  nameInput.type='text'; nameInput.placeholder='Имя';
  nameInput.style.padding='12px'; nameInput.style.border='1px solid var(--line)'; nameInput.style.borderRadius='var(--radius)';

  const phoneInput = document.createElement('input');
  phoneInput.type='tel'; phoneInput.placeholder='+7 (999) 123-45-67';
  phoneInput.value = getSession()?.phone ?? '';
  phoneInput.style.padding='12px'; phoneInput.style.border='1px solid var(--line)'; phoneInput.style.borderRadius='var(--radius)';

  const addrTitle = document.createElement('h4'); addrTitle.textContent='Адрес доставки (г Москва)'; addrTitle.style.margin='8px 0 0';

  // Inline ввод нового адреса (по полям: улица + дом), с подсказками для каждого поля
  const inlineWrap = document.createElement('div');
  inlineWrap.style.display = 'grid';
  inlineWrap.style.gridTemplateColumns = '1fr 1fr';
  inlineWrap.style.gap = '8px';
  const inlineStreetWrap = document.createElement('div'); inlineStreetWrap.className='suggest-wrap'; inlineStreetWrap.style.gridColumn='1 / span 2';
  const inlineStreet = document.createElement('input'); inlineStreet.type='text'; inlineStreet.placeholder='Улица (г Москва)'; inlineStreet.style.padding='12px'; inlineStreet.style.border='1px solid var(--line)'; inlineStreet.style.borderRadius='var(--radius)'; inlineStreet.style.width='100%';
  const inlineStreetList = document.createElement('div'); inlineStreetList.className='suggest-list'; inlineStreetList.style.display='none';
  inlineStreetWrap.append(inlineStreet, inlineStreetList);
  const inlineHouseWrap = document.createElement('div'); inlineHouseWrap.className='suggest-wrap';
  const inlineHouse = document.createElement('input'); inlineHouse.type='text'; inlineHouse.placeholder='Дом'; inlineHouse.style.padding='12px'; inlineHouse.style.border='1px solid var(--line)'; inlineHouse.style.borderRadius='var(--radius)';
  const inlineHouseList = document.createElement('div'); inlineHouseList.className='suggest-list'; inlineHouseList.style.display='none';
  inlineHouseWrap.append(inlineHouse, inlineHouseList);
  const inlineApt = document.createElement('input'); inlineApt.type='text'; inlineApt.placeholder='Кв.'; inlineApt.style.padding='12px'; inlineApt.style.border='1px solid var(--line)'; inlineApt.style.borderRadius='var(--radius)';
  const inlineEntrance = document.createElement('input'); inlineEntrance.type='text'; inlineEntrance.placeholder='Подъезд'; inlineEntrance.style.padding='12px'; inlineEntrance.style.border='1px solid var(--line)'; inlineEntrance.style.borderRadius='var(--radius)';
  const inlineFloor = document.createElement('input'); inlineFloor.type='text'; inlineFloor.placeholder='Этаж'; inlineFloor.style.padding='12px'; inlineFloor.style.border='1px solid var(--line)'; inlineFloor.style.borderRadius='var(--radius)';
  const inlineCode = document.createElement('input'); inlineCode.type='text'; inlineCode.placeholder='Код домофона'; inlineCode.style.padding='12px'; inlineCode.style.border='1px solid var(--line)'; inlineCode.style.borderRadius='var(--radius)';
  // Order fields: Подъезд, Этаж, Кв., Код домофона (после улицы и дома)
  inlineWrap.append(inlineStreetWrap, inlineHouseWrap, inlineEntrance, inlineFloor, inlineApt, inlineCode);

  function getPublicToken(){ return document.querySelector('meta[name="dadata-token"]')?.content?.trim() || '' }
  let inlineStreetChosen=null; let inlineHouseChosen=null; let inlineStreetTimer=null; let inlineHouseTimer=null;

  function houseLabelFromData(d) {
    if (!d) return '';
    const parts = [];
    const h = d.house || '';
    const block = d.block || '';
    const building = d.building || '';
    if (h) parts.push(h);
    if (block) parts.push(`к ${block}`);
    if (building) parts.push(`стр ${building}`);
    return parts.join(' ').trim();
  }
  function mapRespToItems(data) {
    return (data?.suggestions||[]).map(s=>({
      text: s.value || s?.data?.street_with_type || s?.data?.street || '',
      street: s?.data?.street_with_type || s?.data?.street || '',
      house: houseLabelFromData(s?.data) || s?.data?.house || '',
      data: s?.data || null
    }));
  }
  async function fetchSuggest(q, from, to) {
    const directToken = getPublicToken();
    if (directToken && !/^PUT_YOUR_/i.test(directToken)) {
      const r = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',{
        method:'POST', headers:{ 'Content-Type':'application/json','Accept':'application/json','Authorization':`Token ${directToken}` }, body: JSON.stringify({ query:q, count:10, locations:[{kladr_id:'7700000000000'}], from_bound:{value:from}, to_bound:{value:to}, restrict_value:true })
      });
      const d = await r.json().catch(()=>({}));
      return mapRespToItems(d);
    } else {
      let d=null; try{ const r=await fetch(`${API_BASE}/suggest/address?query=${encodeURIComponent(q)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`); d=await r.json().catch(()=>({})); }catch{}
      return mapRespToItems(d);
    }
  }

  let isPickingInline = false;
  function renderList(listEl, items, onPick){
    listEl.innerHTML='';
    if (!items.length) { listEl.style.display='none'; return; }
    items.forEach(s=>{
      const it=document.createElement('div');
      it.className='suggest-item';
      it.textContent=s.text;
      const pick = (e)=>{ e.preventDefault(); e.stopPropagation(); isPickingInline=true; onPick(s); listEl.style.display='none'; setTimeout(()=>{ isPickingInline=false; }, 0); };
      it.addEventListener('pointerdown', pick);
      it.addEventListener('mousedown', pick);
      it.addEventListener('touchstart', pick, { passive:false });
      listEl.append(it);
    });
    listEl.style.display='block';
  }

  function updateStreetSuggest(){
    const q = inlineStreet.value.trim();
    if (inlineStreetTimer) clearTimeout(inlineStreetTimer);
    inlineStreetTimer = setTimeout(async ()=>{
      inlineStreetChosen=null;
      if (q.length<2) { inlineStreetList.style.display='none'; inlineStreetList.innerHTML=''; return; }
      const items = await fetchSuggest(q, 'street','street');
      renderList(inlineStreetList, items, (s)=>{ inlineStreetChosen=s; inlineStreet.value=s.street||s.text; inlineHouse.focus(); });
    }, 180);
  }
  function updateHouseSuggest(){
    if (!inlineStreetChosen?.street) { inlineHouseList.style.display='none'; inlineHouseList.innerHTML=''; return; }
    const qh = `${inlineStreetChosen.street} ${inlineHouse.value.trim()}`.trim();
    if (inlineHouseTimer) clearTimeout(inlineHouseTimer);
    inlineHouseTimer = setTimeout(async ()=>{
      inlineHouseChosen=null;
      if (!inlineHouse.value.trim()) { inlineHouseList.style.display='none'; inlineHouseList.innerHTML=''; return; }
      const items = await fetchSuggest(qh,'house','house');
      renderList(inlineHouseList, items, (s)=>{ inlineHouseChosen=s; inlineHouse.value=s.house || inlineHouse.value; inlineStreet.value=s.street || inlineStreet.value; });
    }, 180);
  }
  inlineStreet.addEventListener('input', updateStreetSuggest);
  inlineStreet.addEventListener('blur', ()=> setTimeout(()=>{ if (!isPickingInline) inlineStreetList.style.display='none'; }, 120));
  inlineHouse.addEventListener('input', updateHouseSuggest);
  inlineHouse.addEventListener('blur', ()=> setTimeout(()=>{ if (!isPickingInline) inlineHouseList.style.display='none'; }, 120));

  // Кнопки подтверждения адреса убрали — адрес валидируется на сервере при создании заказа

  // Выбор времени доставки: ASAP или к назначенному времени
  const timeMode = document.createElement('div'); timeMode.className='filter-tabs';
  const btnAsap = document.createElement('button'); btnAsap.type='button'; btnAsap.textContent='Как можно скорее'; btnAsap.classList.add('active');
  const btnAtTime = document.createElement('button'); btnAtTime.type='button'; btnAtTime.textContent='К назначенному времени';
  timeMode.append(btnAsap, btnAtTime);
  let scheduled = false;

  // Блок выбора дня и слота времени (в одной строке)
  const scheduleWrap = document.createElement('div');
  scheduleWrap.style.display='none';
  scheduleWrap.style.gridTemplateColumns='1fr 1fr';
  scheduleWrap.style.gap='8px';
  scheduleWrap.style.display='none';
  scheduleWrap.className = 'info-grid';
  const daySelect = document.createElement('select');
  daySelect.style.padding='12px'; daySelect.style.border='1px solid var(--line)'; daySelect.style.borderRadius='var(--radius)';
  const timeSlotSelect = document.createElement('select');
  timeSlotSelect.style.padding='12px'; timeSlotSelect.style.border='1px solid var(--line)'; timeSlotSelect.style.borderRadius='var(--radius)';

  function formatDayLabel(d) {
    return d.toLocaleDateString('ru-RU', { weekday:'short', day:'2-digit', month:'short' });
  }
  function ymd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }
  function generateDays() {
    daySelect.innerHTML='';
    for (let i=0;i<7;i++) {
      const d = new Date(); d.setDate(d.getDate()+i);
      const opt = document.createElement('option');
      opt.value = ymd(d);
      opt.textContent = formatDayLabel(d);
      daySelect.append(opt);
    }
  }
  function generateTimeSlots() {
    timeSlotSelect.innerHTML='';
    // слоты 1 час, шаг 30 мин, с 08:00 до 20:00 (последний старт 19:00)
    for (let h=8; h<=19; h++) {
      for (let m=0; m<60; m+=30) {
        const start = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        const endHour = h + ((m===30)?1:1); // всегда +1 час
        const endMin = m;
        const end = `${String(endHour).padStart(2,'0')}:${String(endMin).padStart(2,'0')}`;
        const label = `${start}-${end}`;
        // отбрасываем слот 19:30-20:30 (выходит за 20:00)
        if (h===19 && m===30) continue;
        const opt = document.createElement('option'); opt.value=label; opt.textContent=label; timeSlotSelect.append(opt);
      }
    }
  }
  generateDays();
  generateTimeSlots();
  scheduleWrap.append(daySelect, timeSlotSelect);

  ;[btnAsap, btnAtTime].forEach((b)=> b.addEventListener('click', ()=>{
    timeMode.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    scheduled = (b === btnAtTime);
    scheduleWrap.style.display = scheduled ? 'grid' : 'none';
  }));
  const commentInput = document.createElement('input'); commentInput.type='text'; commentInput.placeholder='Комментарий для курьера'; commentInput.style.padding='12px'; commentInput.style.border='1px solid var(--line)'; commentInput.style.borderRadius='var(--radius)';

  const payRow = document.createElement('div'); payRow.className='filter-tabs';
  const payCash = document.createElement('button'); payCash.type='button'; payCash.textContent='Наличные';
  const payCard = document.createElement('button'); payCard.type='button'; payCard.textContent='Картой курьеру'; payCard.classList.add('active');
  const payOnline = document.createElement('button'); payOnline.type='button'; payOnline.textContent='Онлайн (скоро)';
  let paymentMethod='card_courier';
  ;[payCash,payCard,payOnline].forEach((btn)=>btn.addEventListener('click',()=>{ payRow.querySelectorAll('button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); paymentMethod = btn===payCash?'cash':btn===payCard?'card_courier':'online'; }));
  payRow.append(payCash,payCard,payOnline);

  const placeBtn = document.createElement('button'); placeBtn.className='btn btn--accent'; placeBtn.textContent='Подтвердить заказ';

  const formWrap = document.createElement('div');
  formWrap.className='info-grid'; formWrap.style.gridTemplateColumns='1fr'; formWrap.style.gap='8px';
  // Промокод на странице оформления
  const promoRow = document.createElement('div');
  promoRow.className = 'cart-promo-row';
  const promoInput = document.createElement('input');
  promoInput.type = 'text';
  promoInput.placeholder = 'Промокод';
  promoInput.value = state.promo || '';
  promoInput.style.padding = '8px 12px';
  promoInput.style.border = '1px solid var(--line)';
  promoInput.style.borderRadius = '999px';
  const promoBtn = document.createElement('button');
  promoBtn.className = 'btn';
  promoBtn.textContent = 'Применить';
  promoBtn.addEventListener('click', () => {
    const code = (promoInput.value || '').trim().toUpperCase();
    if (!code) return;
    applyPromo(code);
    // перерисуем страницу, чтобы пересчитать суммы
    renderCheckoutPage();
  });
  promoRow.append(promoInput, promoBtn);

  // Верхняя часть формы (контакты + адрес + время)
  formWrap.append(h, nameInput, phoneInput, addrTitle, inlineWrap, timeMode, scheduleWrap, commentInput);
  // Низ формы с отступом: промокод, оплата, подтверждение
  const bottomWrap = document.createElement('div'); bottomWrap.style.marginTop = '92px'; bottomWrap.style.display='flex'; bottomWrap.style.flexDirection='column'; bottomWrap.style.gap='8px';
  bottomWrap.append(promoRow, payRow, placeBtn);
  formWrap.append(bottomWrap);
  formArea.append(formWrap);

  // Summary
  const summary = document.createElement('div'); summary.className='checkout-summary';
  const itemsCount = state.cart.reduce((a,i)=>a+i.qty,0);
  const subtotal = state.cart.reduce((a,i)=>a+i.qty*i.price,0);
  const totals = calculateTotals(subtotal);
  summary.innerHTML = `
    <div class="cart-summary__row"><span>Товары</span><strong>${itemsCount} шт.</strong></div>
    <div class="cart-summary__row"><span>Сумма</span><strong>${subtotal.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row"><span>Скидка</span><strong>${totals.discount.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row"><span>Доставка</span><strong>${totals.delivery.toLocaleString('ru-RU')} ₽</strong></div>
    <div class="cart-summary__row total"><span>Итого</span><strong>${totals.total.toLocaleString('ru-RU')} ₽</strong></div>
  `;
  summaryArea.append(summary);

placeBtn.addEventListener('click', async ()=>{
    if (scheduled && (!daySelect.value || !timeSlotSelect.value)) { alert('Укажите день и временной интервал'); return; }
    if (!inlineStreetChosen?.street) { alert('Выберите улицу из подсказок'); return; }
    if (!inlineHouseChosen?.house) { alert('Выберите дом из подсказок'); return; }
    if (!state.cart.length) { alert('Корзина пуста'); return; }
    try {
      const payload = {
        phone: normalizePhone(phoneInput.value),
        name: nameInput.value,
        address: `${inlineStreetChosen.street}, ${inlineHouseChosen.house}`
          + `${inlineApt.value? ', кв. '+inlineApt.value:''}`
          + `${inlineEntrance.value? ', подъезд '+inlineEntrance.value:''}`
          + `${inlineFloor.value? ', этаж '+inlineFloor.value:''}`
          + `${inlineCode.value? ', домофон '+inlineCode.value:''}`,
        addressData: { street: inlineStreetChosen.street, house: inlineHouseChosen.house, apt: inlineApt.value.trim(), entrance: inlineEntrance.value.trim(), floor: inlineFloor.value.trim(), code: inlineCode.value.trim() },
        deliveryTime: scheduled ? `${daySelect.value} ${timeSlotSelect.value}` : null,
        deliveryDate: scheduled ? daySelect.value : null,
        deliverySlot: scheduled ? timeSlotSelect.value : null,
        paymentMethod,
        items: state.cart,
        promo: state.promo,
        subtotal,
        discount: totals.discount,
        delivery: totals.delivery,
        total: totals.total
      };
      const res = await fetch(`${API_BASE}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error||'ORDER_FAILED');
      showToast(`Заказ №${data.orderId} создан. Мы скоро свяжемся!`, 'success');
      state.cart = []; renderCart(); saveCart();
      setTimeout(()=>{ window.location.href = `order.html?id=${data.orderId}`; }, 800);
    } catch(err) {
      showToast('Не удалось оформить заказ. Проверьте сервер.', 'error');
    }
  });
}

function renderOrderPage() {
  const qs = new URLSearchParams(window.location.search);
  const id = qs.get('id');
  const box = document.getElementById('orderDetails');
  const title = document.getElementById('orderTitle');
  if (!box) return;
  box.innerHTML = '';
  if (!id) {
    title && (title.textContent = 'Заказ не найден');
    box.innerHTML = '<p class="muted">Не указан номер заказа.</p>';
    return;
  }
  fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`)
    .then(r=>r.json().catch(()=>({})))
    .then(data=>{
      if (!data?.ok || !data?.order) {
        title && (title.textContent = `Заказ #${id}`);
        box.innerHTML = '<p class="muted">Заказ не найден.</p>';
        return;
      }
      const o = data.order;
      title && (title.textContent = `Заказ №${o.id}`);
      const art = document.createElement('article'); art.className='info-card';
      const items = JSON.parse(o.items_json||'[]');
      const list = items.map(i=>`<li>${i.title || i.name} × ${i.qty} — ${(i.price*i.qty).toLocaleString('ru-RU')} ₽</li>`).join('');
      art.innerHTML = `
        <h3>Статус: <span>${o.status}</span></h3>
        <p class="muted">Оформлен: ${new Date(o.created_at).toLocaleString('ru-RU')}</p>
        <p><strong>Адрес:</strong> ${o.address || ''}</p>
        <p><strong>Оплата:</strong> ${o.payment_method || ''}</p>
        <ul class="set-list">${list}</ul>
        <div class="cart-summary__row"><span>Сумма</span><strong>${o.subtotal.toLocaleString('ru-RU')} ₽</strong></div>
        <div class="cart-summary__row"><span>Скидка</span><strong>${o.discount.toLocaleString('ru-RU')} ₽</strong></div>
        <div class="cart-summary__row"><span>Доставка</span><strong>${o.delivery.toLocaleString('ru-RU')} ₽</strong></div>
        <div class="cart-summary__row total"><span>Итого</span><strong>${o.total.toLocaleString('ru-RU')} ₽</strong></div>
      `;
      box.append(art);
    })
    .catch(()=>{
      title && (title.textContent = `Заказ #${id}`);
      box.innerHTML = '<p class="muted">Ошибка загрузки заказа.</p>';
    });
}

function renderAccountOrders() {
  const session = getSession();
  const container = document.querySelector('.best-grid');
  if (!container) return;
  const phone = session?.phone;
  const card = document.createElement('article'); card.className='best-card';
  card.innerHTML = `<h4>Мои заказы</h4><div data-orders-list><p class="muted">${phone? 'Загружаем ваши заказы…': 'Войдите, чтобы увидеть историю заказов.'}</p></div>`;
  container.append(card);
  if (!phone) return;
  fetch(`${API_BASE}/orders?phone=${encodeURIComponent(phone)}`)
    .then(r=>r.json().catch(()=>({})))
    .then(data=>{
      const host = card.querySelector('[data-orders-list]');
      if (!data?.ok) { host.innerHTML = '<p class="muted">Не удалось загрузить заказы.</p>'; return; }
      const orders = data.orders || [];
      if (!orders.length) { host.innerHTML = '<p class="muted">Заказов пока нет.</p>'; return; }
      const list = document.createElement('div'); list.className='info-list';
      orders.forEach(o=>{
        const a = document.createElement('a'); a.href = `order.html?id=${o.id}`; a.textContent = `Заказ №${o.id} — ${new Date(o.created_at).toLocaleString('ru-RU')} — ${o.total.toLocaleString('ru-RU')} ₽ — ${o.status}`;
        const p = document.createElement('p'); p.append(a); list.append(p);
      });
      host.innerHTML=''; host.append(list);
    })
    .catch(()=>{
      const host = card.querySelector('[data-orders-list]');
      host.innerHTML = '<p class="muted">Ошибка загрузки заказов.</p>';
    });
}
