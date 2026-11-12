import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    
 // Check if the final price is less than the suggested retail price
 const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
 
 // Calculate the exact dollar amount saved
 const savings = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);

 return `<li class="product-card">
   <a href="product_pages/?product=${product.Id}">
     <img src="${product.Image}" alt="Image of ${product.Name}">
     <h3 class="card__brand">${product.Brand.Name}</h3>
     <h2 class="card__name">${product.Name}</h2>
     
     <!-- Updated badge showing the exact savings amount -->
     ${isDiscounted ? `<p class="discount-badge">Save $${savings}!</p>` : ''}
     
     <p class="product-card__price">$${product.FinalPrice}</p>
   </a>
 </li>`;
}


export default class ProductList{
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
     list = list.filter((product) =>
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
}