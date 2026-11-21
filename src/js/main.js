import { initNewsletterSignup } from "./newsletter.mjs";

initNewsletterSignup();

async function initHomePageModules() {
 try {
   const { default: ProductData } = await import("./ExternalServices.mjs");
   const { default: ProductList } = await import("./productList.mjs");
   const { countItems } = await import("./utils.mjs");

   const dataSource = new ProductData("tents");
   const element = document.querySelector(".product-list");
   const productList = new ProductList("Tents", dataSource, element);

   productList.init();
   countItems();
 } catch (error) {

   console.warn("Product modules skipped on Live Server:", error.message);
 }
}

initHomePageModules();