import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get pre existing items from Localstorage, if none exist start from empty array.
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(product); // Add item(product) to the array.
  setLocalStorage("so-cart", cartItems); // Set the array back to Localstorage.
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
