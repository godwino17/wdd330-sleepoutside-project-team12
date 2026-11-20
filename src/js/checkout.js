import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".summary");
order.Init();

document.querySelector("#zip-code").addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    order.Checkout();
})
