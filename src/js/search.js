import ProductData from "./ProductData.mjs";
import ProductList from "./productList.mjs";
import { getParam, countItems } from "./utils.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const titleEl = document.querySelector("#searchTitle");

const query = (getParam("q") || "").trim();

// Keep the input value in sync when landing on ?q=...
const searchInput = document.querySelector(`input[name="q"]`);
if (searchInput) searchInput.value = query;

async function init() {
  try {
    countItems();
  } catch (err) {
    console.warn("badge failed", err);
  } // paint the badge on load

  if (!query) {
    titleEl.textContent = "Search Products";
    listElement.innerHTML = `<li class="no-results">Type in the search box above to find products.</li>`;
    return;
  }

  titleEl.textContent = `Results for "${query}"`;

  const results = await dataSource.searchProducts(query);

  if (!results.length) {
    listElement.innerHTML = `<li class="no-results">No products matched "${query}".</li>`;
    return;
  }

  // Reuse the same card template from productList.mjs
  const list = new ProductList("Search", dataSource, listElement);
  list.renderList(results);
}

init();
