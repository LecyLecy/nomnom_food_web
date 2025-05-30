const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";
const container = document.getElementById("favorite-grid");

async function loadFavorites() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    const favorites = data.filter(food => food.favorite === "1" || food.favorite === 1);

    favorites.forEach(food => {
      const card = document.createElement("div");
      card.className = "food-card";
      card.onclick = () => location.href = `food.html?item=${encodeURIComponent(food.slug)}`;

      card.innerHTML = `
        <img src="${food.image}" alt="${food.name}" />
        <div class="food-card-content">
          <div class="food-name">${food.name}</div>
          <div class="food-description">${food.description}</div>
          <div class="food-tags">
            ${food.tags
              .split(",")
              .map(tag => `<span class="food-tag">${tag.trim()}</span>`)
              .join("")}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites yet.</p>";
    }

  } catch (err) {
    console.error("❌ Failed to load favorites:", err);
    container.innerHTML = "<p>Error loading favorite foods.</p>";
  }
}

loadFavorites();
