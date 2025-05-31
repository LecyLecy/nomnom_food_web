const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";

async function loadDashboard() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    renderLastSeen(data);
    renderReminders(data);
    renderFavorites(data);

  } catch (err) {
    console.error("❌ Failed to load dashboard data:", err);
  }
}

// ------------------
// LAST SEEN
// ------------------
function renderLastSeen(data) {
  const lastSeen = data.slice(0, 4); // First 4 rows
  const container = document.getElementById("last-seen");

  lastSeen.forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.onclick = () => location.href = `food.html?item=${encodeURIComponent(food.slug)}`;
    card.innerHTML = `
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div class="food-time">Recently</div>
      </div>
      <img class="food-img" src="${food.image}" alt="${food.name}">
    `;
    container.appendChild(card);
  });
}

// ------------------
// EATING REMINDER
// ------------------
function renderReminders(data) {
  const container = document.getElementById("meal-reminder");

  const mondayMeals = data.filter(food => {
    const plan = food["plan meals"];
    return plan && plan.toLowerCase().startsWith("monday");
  }).slice(0, 3);

  mondayMeals.forEach(food => {
    const mealType = food["plan meals"].split(",")[1].trim();

    const card = document.createElement("div");
    card.className = "food-card";
    card.onclick = () => location.href = `food.html?item=${encodeURIComponent(food.slug)}`;
    card.innerHTML = `
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div class="food-time">
          <img class="clock-icon" src="/assets/clock.svg" alt="Clock">
          <span>${mealType}</span>
        </div>
      </div>
      <img class="food-img" src="${food.image}" alt="${food.name}">
    `;
    container.appendChild(card);
  });
}

// ------------------
// FAVORITES
// ------------------
function renderFavorites(data) {
  const container = document.getElementById("favorite-list");

  const favorites = data
    .filter(food => food.favorite === "1")
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 3);

  favorites.forEach(food => {
    const card = document.createElement("div");
    card.className = "favorite-item";
    card.onclick = () => location.href = `food.html?item=${encodeURIComponent(food.slug)}`;
    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" class="favorite-img">
      <div class="favorite-info">
        <div class="favorite-name">${food.name}</div>
        <div class="favorite-rating">
          <img src="/assets/star.svg" alt="Star" class="star-icon">
          <span>${food.rating}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

loadDashboard();


// Eating Reminder
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let currentDayIndex = 0;
let allFoods = [];

async function loadDashboard() {
  try {
    const res = await fetch(SHEET_URL);
    allFoods = await res.json();

    renderLastSeen(allFoods);
    renderRemindersForDay(DAYS[currentDayIndex]);
    renderFavorites(allFoods);

    // Add arrow navigation
    document.getElementById("day-prev").addEventListener("click", () => {
      currentDayIndex = (currentDayIndex - 1 + DAYS.length) % DAYS.length;
      renderRemindersForDay(DAYS[currentDayIndex]);
    });

    document.getElementById("day-next").addEventListener("click", () => {
      currentDayIndex = (currentDayIndex + 1) % DAYS.length;
      renderRemindersForDay(DAYS[currentDayIndex]);
    });

  } catch (err) {
    console.error("❌ Failed to load dashboard data:", err);
  }
}

function renderRemindersForDay(day) {
  const container = document.getElementById("meal-reminder");
  const dayLabel = document.getElementById("current-day");
  container.innerHTML = "";
  dayLabel.textContent = day;

  const meals = allFoods.filter(food => {
    const plan = food["plan meals"];
    return plan && plan.toLowerCase().startsWith(day.toLowerCase());
  }).slice(0, 3);

  meals.forEach(food => {
    const mealType = food["plan meals"].split(",")[1].trim();

    const card = document.createElement("div");
    card.className = "food-card";
    card.onclick = () => location.href = `food.html?item=${encodeURIComponent(food.slug)}`;
    card.innerHTML = `
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div class="food-time">
          <img class="clock-icon" src="/assets/clock.svg" alt="Clock">
          <span>${mealType}</span>
        </div>
      </div>
      <img class="food-img" src="${food.image}" alt="${food.name}">
    `;
    container.appendChild(card);
  });
}

document.querySelector(".see-all-btn.center").addEventListener("click", () => {
  window.location.href = "plan.html";
});

