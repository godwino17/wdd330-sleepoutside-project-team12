function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async searchProducts(query = "", categories = [this.category]) {
    const all = [];

    for (const category of categories) {
      try {
        const res = await fetch(`../json/${category}.json`);
        if (!res.ok) continue;
        all.push(...(await res.json()))
      } catch (err) {
        console.warn(`Search: could not load ${category}.json`, err);
      }
    }

    const q = query.trim().toLowerCase();
    if (!q) return all;

    return all.filter((p) => {
      const name = p.Name?.toLowerCase() ?? "";
      const brand = p.Brand?.Name?.toLowerCase() ?? "";
      const desc = p.DescriptionHtmlSimple?.toLowerCase() ?? "";
      return name.includes(q) || brand.includes(q) || desc.includes(q);
    });
  }
}
