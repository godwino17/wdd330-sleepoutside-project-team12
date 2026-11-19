import { getParam, countItems, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import productDetails from "./productDetails.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();

const productID = getParam("product");

const product = new productDetails(productID, dataSource);
product.init();

countItems();
