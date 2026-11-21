import ProductData from "./ProductData.mjs";
import ProductList from "./productList.mjs";
import { countItems, loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.js";

new Alert().init();
   const { default: ProductData } = await import("./ExternalServices.mjs");
// Load the header and footer of the page before initializing the product list view
loadHeaderFooter();

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();

countItems();
