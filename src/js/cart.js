import {
  getLocalStorage,
  setLocalStorage,
  countItems,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function calculateCartTotal() {
  const cart = getLocalStorage("so-cart"); // Get cart array from localStorage.

  let total = 0; // Initialize var to store total price.
  // check if the is item in the cart before calculating the price.
  if (cart.length !== 0) {
    cart.forEach(price => {
      total += price.FinalPrice;
    })
    // Display the total price.
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
  }
}

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
  // Check if updated cart is empty, if yes.
  if (updateCartItems.length == 0) {
    cartFooter.classList.replace("show", "hide"); // Permission denied to display cart total details.
  }
  // Set the updated array back to localStorage
  setLocalStorage("so-cart", updateCartItems);

  // Call renderCartContents function to display Cart content.
  renderCartContents();
  countItems();
  total = 0; //  Reset total price back to 0 for a fresh calculation.
  calculateCartTotal(); // calculate and display new updated cart total.
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

countItems();
const cartFooter = document.querySelector(".cart-footer");
// When the page loads for the first time.
// This code checks if item is in cart before calculating and displaying cart total price
if (getLocalStorage("so-cart").length !== 0) {
  cartFooter.classList.replace("hide", "show"); // Permission granted to display cart total details.
  calculateCartTotal(); // calculate and display cart total.
} 
