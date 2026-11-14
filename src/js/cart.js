import { getLocalStorage, setLocalStorage, countItems } from "./utils.mjs";

const CART_KEY = "so-cart";
const MAX_QTY = 99;

function getCartItems() {
  const items = getLocalStorage(CART_KEY);
  return Array.isArray(items) ? items : [];
}

function saveCartItems(items) {
  setLocalStorage(CART_KEY, items);
  renderCartContents();
  countItems();
}

function renderCartContents() {
  const cartItems = getCartItems();
  const list = document.querySelector(".product-list");
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = `<li class="cart-card divider">Your cart is empty.</li>`;
    return;
  }
  list.innerHTML = cartItems.map(cartItemTemplate).join("");
}

function cartItemTemplate(item) {
  const qty = item.Quantity || 1;
  const colorName = item.Colors?.[0]?.ColorName || "";
  const detailUrl = `/product_pages/index.html?product=${item.Id}`;
  const lineTotal = (item.FinalPrice * qty).toFixed(2);

  return `<li class="cart-card divider">
  <a href="${detailUrl}" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="${detailUrl}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>

  <div class="cart-card__quantity">
    <button class="qty-btn" data-id="${item.Id}" data-action="decrement"
            aria-label="Decrease quantity" ${qty <= 1 ? "disabled" : ""}>−</button>
    <span class="qty-value">${qty}</span>
    <button class="qty-btn" data-id="${item.Id}" data-action="increment"
            aria-label="Increase quantity" ${qty >= MAX_QTY ? "disabled" : ""}>+</button>
  </div>

  <p class="cart-card__price">$${lineTotal}</p>
  <button class="removeItem" data-id="${item.Id}">X</button>
</li>`;
}

function removeItemFromCart(itemID) {
  saveCartItems(getCartItems().filter((item) => item.Id !== itemID));
}

function changeQuantity(itemID, action) {
  const items = getCartItems();
  const item = items.find((i) => i.Id === itemID);
  if (!item) return;

  const current = item.Quantity || 1;
  const next = action === "increment" ? current + 1 : current - 1;

  if (next < 1 || next > MAX_QTY) return; // clamp
  item.Quantity = next;
  saveCartItems(items);
}

// One delegated handler for everything inside .product-list
document.querySelector(".product-list").addEventListener("click", (e) => {
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    changeQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action);
    return;
  }

  const removeBtn = e.target.closest(".removeItem");
  if (removeBtn) {
    removeItemFromCart(removeBtn.dataset.id);
  }
});

renderCartContents();
countItems();