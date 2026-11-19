import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./productList.mjs";
import { countItems, loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

document.querySelector("h2").textContent += `: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

const dataSource = new ExternalServices();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

productList.init();

countItems();
