import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".summary");
order.Init();

document
  .querySelector("#zip-code")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.getElementById("my-form");
  const formStatus = myForm.checkValidity();
  myForm.reportValidity(); // trigger manual browser error message.

  if (formStatus) {
    order.Checkout();
  }
});
