// Замените на свой API-ключ
const token = "7fd18aaabd7d53ffa4846e4521c1f736c13490eb";
const type = "address";

const { createSuggestions } = window.Dadata;

const regionInput = document.getElementById("region");
const cityInput = document.getElementById("city");
const streetInput = document.getElementById("street");
const houseInput = document.getElementById("house");

const regionSuggestions = createSuggestions(regionInput, {
  token,
  type,
  hint: false,
  params: { from_bound: { value: "region" }, to_bound: { value: "area" } }
});

const citySuggestions = createSuggestions(
  cityInput,
  {
    token,
    type,
    hint: false,
    params: { from_bound: { value: "city" }, to_bound: { value: "settlement" } }
  },
  regionSuggestions
);

const streetSuggestions = createSuggestions(
  streetInput,
  {
    token,
    type,
    hint: false,
    count: 15,
    params: { from_bound: { value: "street" }, to_bound: { value: "street" } }
  },
  citySuggestions
);

createSuggestions(
  houseInput,
  {
    token,
    type,
    hint: false,
    noSuggestionsHint: false,
    count: 15,
    params: { from_bound: { value: "house" }, to_bound: { value: "house" } }
  },
  streetSuggestions
);
