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
  countInventory();
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  return urlParam.get(param);
};

export function countItems() {
  const number = document.getElementById("amount");

  const cartItems = getLocalStorage("so-cart");

  // number.textContent = cartItems.length;
  console.log("Hello!");
};

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  const templateText = await response.text();
  return templateText;
}

export async function loadHeaderFooter() {
  const headerPath = await loadTemplate("/partials/header.html");
  const footerPath = await loadTemplate("/partials/footer.html");

  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  renderWithTemplate(headerPath, headerElement);
  renderWithTemplate(footerPath, footerElement);
}

export function countInventory() {
  const productContainer = document.getElementById("product-detail");
  const breadcrumb = document.getElementById("breadcrumb");
  const productCategory = document.getElementById("product-category");
  
  
  if (breadcrumb) {
    const category = getParam("category");
    const numberOfItems = productContainer.childElementCount;
    breadcrumb.textContent = `${category}: ${numberOfItems} items.`;
  }

  if (productCategory) {
    productCategory.textContent = `Product category`;
  }

}