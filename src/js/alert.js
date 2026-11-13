export default class Alert {
  constructor(path = "/json/alerts.json") {
    this.path = path;
  }

  async init() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) throw new Error(`Alerts failed to load: ${response.status}`);
      const alerts = await response.json();
      if (!alerts.length) return;

      const section = document.createElement("section");
      section.className = "alert-list";

      alerts.forEach((alert) => {
        const p = document.createElement("p");
        p.textContent = alert.message;
        p.style.background = alert.background;
        p.style.color = alert.color;
        section.appendChild(p);
      });

      document.querySelector("main").prepend(section);
    } catch (error) {
      console.error(error);
    }
  }
}