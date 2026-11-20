function isValidEmail(email) {
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailPattern.test(email);
}

function showMessage(element, text, type) {
 element.textContent = text;
 element.className = `newsletter-message ${type}`;
}

export function initNewsletterSignup() {
 const form = document.querySelector("#newsletter-form");
 const emailInput = document.querySelector("#newsletter-email");
 const messageEl = document.querySelector("#newsletter-message");

 if (!form || !emailInput || !messageEl) {
   return;
 }

 form.addEventListener("submit", (event) => {
   event.preventDefault();

   const email = emailInput.value.trim();

   if (!email) {
     showMessage(messageEl, "Please enter your email address.", "error");
     emailInput.focus();
     return;
   }

   if (!isValidEmail(email)) {
     showMessage(messageEl, "Please enter a valid email address.", "error");
     emailInput.focus();
     return;
   }

   const savedSubscribers =
     JSON.parse(localStorage.getItem("newsletterSubscribers")) || [];

   if (!savedSubscribers.includes(email)) {
     savedSubscribers.push(email);
     localStorage.setItem(
       "newsletterSubscribers",
       JSON.stringify(savedSubscribers)
     );
   }

   showMessage(
     messageEl,
     `Thanks for signing up! ${email} is now subscribed to our newsletter.`,
     "success"
   );
   form.reset();
 });
}