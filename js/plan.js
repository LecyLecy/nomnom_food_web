const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

let currentDayIndex = 0;
let allFoods = [];

const dayLabel = document.getElementById("selected-day");
const container = document.getElementById("plan-grid");

document.getElementById("prev-day").addEventListener("click", () => {
    currentDayIndex = (currentDayIndex - 1 + DAYS.length) % DAYS.length;
    localStorage.setItem("selectedDayIndex", currentDayIndex);
    renderPlanForDay();
  });
  
  document.getElementById("next-day").addEventListener("click", () => {
    currentDayIndex = (currentDayIndex + 1) % DAYS.length;
    localStorage.setItem("selectedDayIndex", currentDayIndex);
    renderPlanForDay();
  });  

async function updatePlanMeals(slug, newValue) {
  try {
    await fetch(`${SHEET_URL}/slug/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "plan meals": newValue })
    });
    console.log(`✅ Updated "${slug}" with plan meals: ${newValue}`);
  } catch (err) {
    console.error("❌ Failed to update plan meals:", err);
  }
}

function createFoodCard(food, day, meal) {
  const card = document.createElement("div");
  card.className = "food-card";

  card.innerHTML = `
    <img src="assets/trash.svg" class="trash-icon" />
    <img src="${food.image}" alt="${food.name}" class="food-img" />
    <div class="food-card-content">
      <div class="food-name">${food.name}</div>
      <div class="food-description">${food.description}</div>
    <div class="food-tags">
    <span class="food-tag">${meal}</span>
    </div>
    </div>
  `;

  const trash = card.querySelector(".trash-icon");
  trash.addEventListener("click", async (e) => {
    e.stopPropagation();
    await updatePlanMeals(food.slug, ""); // Clear the "plan meals"
    location.reload(); // Full page reload
  });

  card.addEventListener("click", () => {
    location.href = `food.html?item=${encodeURIComponent(food.slug)}`;
  });

  return card;
}

function createAddCard(meal) {
  const addCard = document.createElement("div");
  addCard.className = "add-card";
  addCard.innerHTML = `
    <img src="assets/positive.svg" alt="Add Icon" />
    <span>Add ${meal}</span>
  `;

  // Future logic:
  // addCard.addEventListener("click", () => openModalForMeal(meal, selectedDay))

  return addCard;
}

function renderPlanForDay() {
  const selectedDay = DAYS[currentDayIndex];
  dayLabel.textContent = selectedDay;
  container.innerHTML = "";

  MEALS.forEach(meal => {
    const planKey = `${selectedDay}, ${meal}`;
    const match = allFoods.find(food => {
      const plan = food["plan meals"];
      return plan && plan.toLowerCase() === planKey.toLowerCase();
    });

    if (match) {
      container.appendChild(createFoodCard(match, selectedDay, meal));
    } else {
      container.appendChild(createAddCard(meal));
    }
  });
}

async function loadData() {
  try {
    const res = await fetch(SHEET_URL);
    allFoods = await res.json();
    const savedIndex = localStorage.getItem("selectedDayIndex");
    if (savedIndex !== null) {
    currentDayIndex = parseInt(savedIndex);
    }
    renderPlanForDay();
  } catch (err) {
    console.error("❌ Failed to load data:", err);
    container.innerHTML = "<p>Error loading data.</p>";
  }
}

loadData();
