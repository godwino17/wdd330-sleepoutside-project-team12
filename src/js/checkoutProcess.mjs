import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    // convert the form data to a JSON object
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    })
    return convertedJSON;
}

function packageItems(items) {
    // console.log(items); //Array of items

    const simplifiedFormat = items.map(item => {
        
        return {
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: 1,
        };
    });
    return simplifiedFormat;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    Init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSubtotal();
    }

    calculateItemSubtotal() {
        // calculate & display the total amount of the item in the cart and the number of items.
        const summaryElement = document.querySelector(this.outputSelector + " .subtotal");
        const itemNumberElement = document.querySelector(this.outputSelector + " .num-items");

        itemNumberElement.innerText = this.list.length;
        // calculate the total of all the items in the cart
        const amount = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amount.reduce((sum, item) => sum + item);
        summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
        this.tax = (this.itemTotal * .06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping))
        
        // Display the totals.
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // Once the totals are all calculated display them in the order summary page
        const tax = document.querySelector(`${this.outputSelector} .tax`);
        const shipping = document.querySelector(`${this.outputSelector} .shipping-est`);
        const orderTotal = document.querySelector(`${this.outputSelector} .order-total`);

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async Checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.itemTotal;
        order.shipping = this.shipping;
        order.tax = this.tax;
        order.items = packageItems(this.list);
        // console.log(order);

        try {
            await services.checkout(order);
            // clear out the cart upon successful order placement
            setLocalStorage("so-cart", []);
            // Take/Redirect user to the success confirmation page.
            location.assign("/checkout/success.html");
        } catch (e) {
            removeAllAlerts();
            console.log(e);
            console.log("failed");
            if (e.message.cardNumber === "Invalid Card Number") {
                alertMessage("Invalid Card Number");
            }
            if (e.message.expiration === "Card expired") {
                alertMessage("Invalid expiration date");
            }
        }
    }
}