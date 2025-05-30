const categoryListEl = document.getElementById("category-list");
const foodGridEl = document.getElementById("food-grid");

let allFoods = [];
let activeCategory = "All";

// ✅ Load from Google Sheets instead of local JSON
fetch("https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647")
  .then(res => res.json())
  .then(data => {
    allFoods = data.map(food => ({
      ...food,
      tags: food.tags ? food.tags.split(",").map(t => t.trim()) : [],
    }));
    renderCategories();
    renderFoods();
  });

// === Category rendering ===
function renderCategories() {
  const tagCount = {};

  allFoods.forEach(food => {
    food.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const allCard = createCategoryCard("All", allFoods.length);
  categoryListEl.appendChild(allCard);

  Object.entries(tagCount).forEach(([tag, count]) => {
    const card = createCategoryCard(tag, count);
    categoryListEl.appendChild(card);
  });
}

function createCategoryCard(tag, count) {
  const card = document.createElement("div");
  card.className = "category-card";
  if (tag === activeCategory) card.classList.add("active");

  card.innerHTML = `
    <div class="category-name">${tag}</div>
    <div class="category-count">${count} foods</div>
  `;

  card.addEventListener("click", () => {
    activeCategory = tag;
    updateActiveCategory();
    renderFoods();
  });

  return card;
}

function updateActiveCategory() {
  document.querySelectorAll(".category-card").forEach(el => {
    el.classList.remove("active");
    if (el.querySelector(".category-name").innerText === activeCategory) {
      el.classList.add("active");
    }
  });
}

// === Food cards rendering ===
function renderFoods() {
  foodGridEl.innerHTML = "";

  const filtered = activeCategory === "All"
    ? allFoods
    : allFoods.filter(food => food.tags.includes(activeCategory));

  filtered.forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.onclick = () =>
      window.location.href = `food.html?item=${encodeURIComponent(food.slug)}`;

    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <div class="food-card-content">
        <div class="food-name">${food.name}</div>
        <div class="food-description">${food.description}</div>
        <div class="food-tags">
          ${food.tags.map(tag => `<span class="food-tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;

    foodGridEl.appendChild(card);
  });
}
