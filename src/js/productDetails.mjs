import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class productDetails {
    constructor(productID, dataSource) {
        this.productId = productID; // from getParam in utils
        this.dataSource = dataSource; // from productData in productData
        this.product = {}
    }

    addProductToCart() {
        // Get pre existing items from Localstorage, if none exist start from empty array.
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product); // Add item(product) to the array.
        setLocalStorage("so-cart", cartItems); // Set the array back to Localstorage.
    }

    renderProductDetails(product) {
        document.querySelector("h3").textContent = product.Brand.Name;
        document.querySelector("h2").textContent = product.NameWithoutBrand;

        const productImg = document.querySelector(".productImage");
        productImg.src = product.Image;
        productImg.alt = product.NameWithoutBrand;

        document.querySelector(".product-card__price").textContent = `$${product.FinalPrice}`;
        document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
        document.querySelector(".product__description").textContent = product.DescriptionHtmlSimple;

        document.querySelector("#addToCart").dataset.id = product.id;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        this.renderProductDetails(this.product);

        // add listener to Add to Cart button
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }
}