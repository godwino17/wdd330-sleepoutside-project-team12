import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    
 // Check if the final price is less than the suggested retail price
 const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
 
 // Calculate the exact dollar amount saved
 const savings = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);

 return `<li class="product-card">
   <a href="/product_pages/?product=${product.Id}">
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
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        // const htmlString= list.map(productCardTemplate);
        // this.listElement.innerHTML = htmlString.join("");

        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}