import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (cartItems !== null) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
  }
}

function removeItemFromCart(itemID) {
  // pull out cart items from localStorage
  const cartItems = getLocalStorage("so-cart");
  // Filter cart content to remove the given ID passed through the parameter
  const updateCartItems = cartItems.filter((item) => item.Id !== itemID);
  // Set the updated array back to localStorage
  setLocalStorage("so-cart", updateCartItems);

  // Call renderCartContents function to display Cart content.
  renderCartContents();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="removeItem" data-id=${item.Id}>X</button>
</li>`;

  return newItem;
}

renderCartContents();

// Add clicks event on the static parent element housing the delete button
document.querySelector(".product-list").addEventListener("click", (e) => {
  // Check if what the user clicked is actually a remove button
  if (e.target.classList.contains("removeItem")) {
    const itemID = e.target.dataset.id;
    removeItemFromCart(itemID);
  }
});
