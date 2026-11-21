// src/js/orders.js
import { requireAuth, fetchWithAuth, logout } from "./auth.js";

// Gate the page before doing anything else. If this returns false the
// browser is already navigating to /login/?redirect=/orders/.
if (requireAuth()) {
  init();
}

async function init() {
  const statusEl = document.getElementById("orders-status");
  const tableEl = document.getElementById("orders-table");
  const bodyEl = document.getElementById("orders-body");

  statusEl.textContent = "Loading orders…";

  try {
    const data = await fetchWithAuth("orders");
    // Backend wraps results in { result: [...] }
    const orders = data.result ?? [];

    if (!orders.length) {
      statusEl.textContent = "No orders yet.";
      return;
    }

    renderOrders(bodyEl, orders);
    statusEl.textContent = "";
    tableEl.hidden = false;
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.classList.add("orders__status--error");
  }
}

function renderOrders(tbody, orders) {
  const rows = orders.map((order) => {
    const itemCount = order.items?.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0,
    );
    const total = order.items
      ?.reduce(
        (sum, item) =>
          sum + (item.product?.FinalPrice ?? 0) * (item.quantity ?? 1),
        0,
      )
      .toFixed(2);

    return `
      <tr>
        <td>${order.id ?? "—"}</td>
        <td>
          ${order.fname ?? ""} ${order.lname ?? ""}<br />
          <small>${order.email ?? ""}</small>
        </td>
        <td>${formatDate(order.orderDate)}</td>
        <td>${itemCount ?? "—"}</td>
        <td>$${total ?? "0.00"}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rows.join("");
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  logout();
  window.location.replace("/login/");
});
