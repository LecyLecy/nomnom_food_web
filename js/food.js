const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";
const params = new URLSearchParams(window.location.search);
const item = params.get("item");
console.log("Fetching:", `${SHEET_URL}?slug=${item}`);

async function loadFoodData() {
  if (!item) return;

  try {
    const response = await fetch(`${SHEET_URL}?slug=${item}`);
    const result = await response.json();
    const food = result.find(f => f.slug?.toLowerCase() === item?.toLowerCase());

    if (!food) {
      document.querySelector(".food-page").innerHTML = `<h2>❌ Food not found: ${item}</h2>`;
      return;
    }

    // ✅ Populate content
    document.getElementById("food-title").textContent = food.name;
    document.getElementById("food-image").src = food.image;
    document.getElementById("food-time").textContent = `${food["time to cook"]} mins`;
    document.getElementById("food-calories").textContent = `${food.calories} cal`;
    document.querySelector(".food-description").textContent = food.description;
    document.getElementById("store-link").href = `https://www.google.com/maps/search/nearest+${food.name}+store`;

    // ✅ Tags
    const tagBox = document.getElementById("food-tags");
    tagBox.innerHTML = "";
    food.tags.split(",").forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag.trim();
      tagBox.appendChild(span);
    });

    // ✅ Ingredients
    const ingredientsBox = document.querySelector(".food-ingredients");
    ingredientsBox.innerHTML = "";
    food.ingredients.split(",").forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing.trim();
      ingredientsBox.appendChild(li);
    });

    // ✅ Benefits
    const benefitBox = document.getElementById("food-benefits");
    benefitBox.innerHTML = "";
    food.benefits.split(",").forEach(b => {
      const li = document.createElement("li");
      li.textContent = b.trim();
      benefitBox.appendChild(li);
    });

    // ✅ Heart favorite logic (toggle)
    const favIcon = document.getElementById("fav-icon");
    let isFavorite = food.favorite === "1";

    function updateFavoriteUI() {
      favIcon.src = isFavorite ? "assets/red_heart.svg" : "assets/heart.svg";
    }

    updateFavoriteUI();

    favIcon.addEventListener("click", async () => {
      isFavorite = !isFavorite;
      updateFavoriteUI();

      try {
        await fetch(`${SHEET_URL}/slug/${food.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            favorite: isFavorite ? "1" : "0"
          })
        });
        console.log("✅ Favorite status updated");
      } catch (error) {
        console.error("❌ Failed to update favorite:", error);
      }
    });

  } catch (error) {
    console.error("❌ Error loading food:", error);
    document.querySelector(".food-page").innerHTML = "<h2>Error loading food data.</h2>";
  }
}

loadFoodData();
