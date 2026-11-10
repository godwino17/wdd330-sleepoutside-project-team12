import ProductData from "./ProductData.mjs";
import ProductList from "./productList.mjs";
import { countItems, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");


const productList = new ProductList("Tents", dataSource, element);

productList.init();

countItems();
