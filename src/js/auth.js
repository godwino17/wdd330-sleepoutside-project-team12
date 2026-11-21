// src/js/auth.js

const TOKEN_KEY = "so-token";

/**
 * POST credentials to the backend.
 * Returns the access token on success, throws on failure.
 */
export async function login(email, password) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // 401 = bad credentials; anything else = server problem
    if (response.status === 401) {
      throw new Error("Invalid email or password.");
    }
    throw new Error(`Login failed (${response.status}). Please try again.`);
  }

  const data = await response.json();
  const token = data.accessToken;
  if (!token) {
    throw new Error("Server returned no access token.");
  }
  return token;
}

export function setToken(token) {
  // sessionStorage = cleared when tab closes (safer default for admin pages)
  // localStorage  = persists across tabs (more convenient but XSS-exposed)
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Redirect to /login/ if no token is present.
 * Preserves the current URL so login can bounce back after success.
 * Returns true if the caller is allowed to continue.
 */
export function requireAuth() {
  if (isLoggedIn()) return true;

  const here = window.location.pathname + window.location.search;
  const redirect = encodeURIComponent(here);
  window.location.replace(`/login/?redirect=${redirect}`);
  return false;
}

/**
 * Read the `?redirect=` param, if present, and sanitize it to a
 * same-origin path. Prevents open-redirect via `?redirect=https://evil.com`.
 */
export function getPostLoginRedirect(fallback = "/orders/") {
  const raw = new URLSearchParams(window.location.search).get("redirect");
  if (!raw) return fallback;
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

/**
 * Fetch with the bearer token attached. Throws on non-2xx.
 */
export async function fetchWithAuth(path) {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated.");
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    // Token expired or was revoked
    logout();
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }

  return response.json();
}
