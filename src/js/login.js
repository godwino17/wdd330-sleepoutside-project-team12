// src/js/login.js
import { login, setToken, isLoggedIn, getPostLoginRedirect } from "./auth.js";

const errorBox = document.getElementById("login-error");
const form = document.getElementById("login-form");
const submitButton = document.getElementById("login-submit");

// If they're already logged in, bounce them to the destination
if (isLoggedIn()) {
  window.location.replace(getPostLoginRedirect());
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showError("Please enter both an email and a password.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Signing in…";

  try {
    const token = await login(email, password);
    setToken(token);
    window.location.replace(getPostLoginRedirect());
  } catch (error) {
    showError(error.message);
    form.password.value = "";
    form.password.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Log In";
  }
});
