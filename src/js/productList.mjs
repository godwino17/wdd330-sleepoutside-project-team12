import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Temporary: check what image data the API gives us (delete after testing)
  

  // Check if the final price is less than the suggested retail price
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  // Calculate the exact dollar amount saved
  const savings = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);

  // Use the responsive image sizes if the API provides them,
  // otherwise fall back to the single image
  const images = product.Images;
  const imageHtml = images
    ? `<picture>
         <source media="(min-width: 1200px)" srcset="${images.PrimaryExtraLarge}">
         <source media="(min-width: 800px)" srcset="${images.PrimaryLarge}">
         <source media="(min-width: 500px)" srcset="${images.PrimaryMedium}">
         <img src="${images.PrimarySmall}" alt="Image of ${product.Name}" loading="lazy">
       </picture>`
    : `<img src="${product.Image}" alt="Image of ${product.Name}">`;

  return `<li class="product-card">
   <a href="/product_pages/?product=${product.Id}">
     ${imageHtml}
     <h3 class="card__brand">${product.Brand.Name}</h3>
     <h2 class="card__name">${product.Name}</h2>
     ${isDiscounted ? `<p class="discount-badge">Save $${savings}!</p>` : ""}
     <p class="product-card__price">$${product.FinalPrice}</p>
   </a>
 </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // 1. Get the list of products from the data source
    let list = await this.dataSource.getData(this.category);

    // 2. Check if a search query exists in the URL (e.g. ?search=tent)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");

    if (searchQuery) {
      // Filter the product list based on the search query
      list = list.filter(
        (product) =>
          product.NameWithoutBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.DescriptionHtmlSimple.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Optional: Update page title if present
      const titleElement = document.querySelector(".products-title");
      if (titleElement) {
        titleElement.textContent = `Search Results for "${searchQuery}"`;
      }
    }

    // 3. Render the filtered or full list
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}