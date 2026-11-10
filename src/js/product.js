import { getParam, countItems, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import productDetails from "./productDetails.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");

const productID = getParam("product");

const product = new productDetails(productID, dataSource);
product.init();

countItems();
