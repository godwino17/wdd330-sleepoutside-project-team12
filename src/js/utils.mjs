// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function renderListWithTemplate(templateFn, parentElement, list, position="afterbegin", clear=false) {
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
  // parentElement.innerHTML = htmlStrings.join("");
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  return urlParam.get(param);
};

export function countItems() {
  const number = document.getElementById("amount");
  if (!number) return;
  const raw = getLocalStorage("so-cart");

  // Guarantee an array no matter what's in storage
  const cartItems = Array.isArray(raw) ? raw : [];

  // Heal the store so other pages don't hit the same crash
  if (raw !== null && !Array.isArray(raw)) {
    console.warn("so-cart was not an array; resetting to []", raw);
    setLocalStorage("so-cart", []);
  }

  const count = cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  badge.textContent = count;
}