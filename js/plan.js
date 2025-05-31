const SHEET_URL = "https://api.sheetbest.com/sheets/f7d3dcb0-e6c7-4e53-a0e4-9109d61d2647";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

let currentDayIndex = parseInt(localStorage.getItem("planDayIndex")) || 0;
let allFoods = [];

const popup = document.getElementById("food-popup");
const popupList = document.getElementById("popup-food-list");
let lastOpenedMealType = null;

function saveDayIndex(index) {
  localStorage.setItem("planDayIndex", index);
}

document.getElementById("prev-day").addEventListener("click", () => {
  currentDayIndex = (currentDayIndex - 1 + DAYS.length) % DAYS.length;
  saveDayIndex(currentDayIndex);
  renderPlanForDay(DAYS[currentDayIndex]);
});

document.getElementById("next-day").addEventListener("click", () => {
  currentDayIndex = (currentDayIndex + 1) % DAYS.length;
  saveDayIndex(currentDayIndex);
  renderPlanForDay(DAYS[currentDayIndex]);
});

function renderPlanForDay(day) {
  const container = document.getElementById("plan-grid");
  const dayLabel = document.getElementById("selected-day");
  container.innerHTML = "";
  dayLabel.textContent = day;

  MEALS.forEach(meal => {
    const match = allFoods.find(f => {
      const plan = f["plan meals"];
      return plan && plan.toLowerCase() === `${day.toLowerCase()}, ${meal.toLowerCase()}`;
    });

    if (match) {
      const card = document.createElement("div");
      card.className = "food-card";
      card.innerHTML = `
        <img src="assets/trash.svg" class="trash-icon" data-meal="${meal}" />
        <img src="${match.image}" alt="${match.name}" class="food-img" />
        <div class="food-card-content">
          <div class="food-name">${match.name}</div>
          <div class="food-description">${match.description}</div>
          <div class="food-time">${meal}</div>
        </div>
      `;
      card.onclick = () => location.href = `food.html?item=${encodeURIComponent(match.slug)}`;

      card.querySelector(".trash-icon").addEventListener("click", e => {
        e.stopPropagation();
        const addCard = document.createElement("div");
        addCard.className = "add-card";
        addCard.innerHTML = `
          <img src="assets/positive.svg" alt="Add" />
          <span>Add ${meal}</span>
        `;
        addCard.onclick = () => {
          lastOpenedMealType = meal;
          openPopup();
        };
        card.replaceWith(addCard);
      });

      container.appendChild(card);
    } else {
      const addCard = document.createElement("div");
      addCard.className = "add-card";
      addCard.innerHTML = `
        <img src="assets/positive.svg" alt="Add" />
        <span>Add ${meal}</span>
      `;
      addCard.onclick = () => {
        lastOpenedMealType = meal;
        openPopup();
      };
      container.appendChild(addCard);
    }
  });
}

function openPopup() {
  popup.classList.remove("hidden");
  renderPopupItems();
}

function closePopup() {
  popup.classList.add("hidden");
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup-overlay")) {
    closePopup();
  }
});

function renderPopupItems() {
  popupList.innerHTML = "";
  allFoods.forEach(food => {
    const item = document.createElement("div");
    item.className = "popup-food-item";
    item.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <span>${food.name}</span>
    `;
    item.onclick = () => {
      closePopup();
      renderPlanForDay(DAYS[currentDayIndex]);
    };
    popupList.appendChild(item);
  });
}

async function loadData() {
  try {
    const res = await fetch(SHEET_URL);
    allFoods = await res.json();
    renderPlanForDay(DAYS[currentDayIndex]);
  } catch (err) {
    console.error("❌ Failed to load foods:", err);
    document.getElementById("plan-grid").innerHTML = "<p>Error loading data.</p>";
  }
}

loadData();
