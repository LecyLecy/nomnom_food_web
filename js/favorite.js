const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";
const container = document.getElementById("favorite-grid");

async function updateFavoriteStatus(slug, status) {
  const res = await fetch(`${SHEET_URL}/slug/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorite: status })
  });

  const result = await res.json();
  console.log("🔄 PATCH response:", result);
}

async function loadFavorites() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    // Only show favorite items
    const items = data.filter(food => food.favorite === "1" || food.favorite === 1);

    items.forEach(food => {
      const card = document.createElement("div");
      card.className = "food-card";

      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${food.image}" alt="${food.name}" class="food-img" />
          <div class="rating-pill">
            <img src="assets/star.svg" alt="Rating" />
            <span>${food.rating || "4.0"}</span>
          </div>
          <img 
            src="assets/red_heart.svg" 
            class="heart-icon" 
            data-slug="${food.slug}" 
            data-favorite="1" 
          />
        </div>
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

    if (items.length === 0) {
      container.innerHTML = "<p>No favorites yet.</p>";
    }

    // Toggle heart icon without removing
    document.querySelectorAll(".heart-icon").forEach(icon => {
      icon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const slug = icon.dataset.slug;
        const isFavorite = icon.dataset.favorite === "1";

        if (isFavorite) {
          icon.src = "assets/heart.svg";
          icon.dataset.favorite = "0";
          await updateFavoriteStatus(slug, "0");
        } else {
          icon.src = "assets/red_heart.svg";
          icon.dataset.favorite = "1";
          await updateFavoriteStatus(slug, "1");
        }
      });
    });

  } catch (err) {
    console.error("❌ Failed to load favorites:", err);
    container.innerHTML = "<p>Error loading foods.</p>";
  }
}

loadFavorites();
