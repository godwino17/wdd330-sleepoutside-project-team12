const STORAGE_KEY = "so-registration-dismissed";

export default function initRegistrationModal() {
  // Only run on a first visit
  if (localStorage.getItem(STORAGE_KEY) === "true") return;

  const modal = document.getElementById("registration-modal");
  if (!modal || typeof modal.showModal !== "function") return;
  if (modal.open) return; // already open, don't double-trigger

  // Open it once the DOM is ready (module scripts are deferred, so this is safe)
  modal.showModal();

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    modal.close();
  };

  // Close button
  modal
    .querySelector(".registration-modal__close")
    ?.addEventListener("click", dismiss);

  // Click on the backdrop (the <dialog> itself, not its inner content)
  modal.addEventListener("click", (event) => {
    if (event.target === modal) dismiss();
  });

  // Esc is handled natively by <dialog>. Also record dismissal:
  modal.addEventListener("close", () => {
    localStorage.setItem(STORAGE_KEY, "true");
  });

  // Fake "register" — replace the console.log with a real POST later
  modal
    .querySelector(".registration-modal__form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = modal.querySelector("#reg-email")?.value.trim();
      if (!email) return;

      // TODO: POST to your registration endpoint, e.g.:
      //   await fetch(`${import.meta.env.VITE_SERVER_URL}register`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email }),
      //   });
      console.log("Registering giveaway entry for:", email);

      localStorage.setItem(STORAGE_KEY, "true");
      modal.close();
    });
}
