import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import productDetails from "./productDetails.mjs";

const dataSource = new ProductData("tents");

const productID = getParam("product");

const product = new productDetails(productID, dataSource);
product.init();
