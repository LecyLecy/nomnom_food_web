// Load sidebar
fetch("layout/navigation.html")
  .then(response => response.text())
  .then(html => {
    document.getElementById("sidebar-placeholder").innerHTML = html;

    // ✅ Highlight active navigation item
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
      const page = item.getAttribute("data-page");
      if (page === currentPage) {
        item.classList.add("active");
      }
    });
    
  });

// Load header
fetch("layout/header.html")
  .then(response => response.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;

    // ✅ Dynamic page title
    const titleMap = {
      "dashboard": "Dashboard",
      "faq": "FAQ",
      "favorite": "Favorite",
      "schedule": "Schedule",
    };

    const fileName = window.location.pathname.split("/").pop().replace(".html", "");
    const formattedTitle = titleMap[fileName] || fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.textContent = formattedTitle;

    // ✅ Search bar interaction
    const input = document.getElementById("search-input");
    const suggestions = document.getElementById("search-suggestions");
    const closeBtn = suggestions?.querySelector(".close-btn");

    if (input && suggestions && closeBtn) {
      input.addEventListener("focus", () => {
        suggestions.classList.remove("hidden");
      });

      closeBtn.addEventListener("click", () => {
        suggestions.classList.add("hidden");
      });

      document.addEventListener("click", (event) => {
        const isInsideSearch =
          input.contains(event.target) ||
          suggestions.contains(event.target) ||
          event.target.closest(".search-bar-container");

        if (!isInsideSearch) {
          suggestions.classList.add("hidden");
        }
      });
    }

    // ✅ Dropdown toggle & page navigation
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
      });

      dropdownMenu.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const link = btn.getAttribute("data-link");
          if (link) {
            window.location.href = link;
          }
        });
      });

      document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
          dropdownMenu.classList.add("hidden");
        }
      });
    }

    // ✅ Notification toggle
const notifIcon = document.querySelector("img[alt='Notifications']");
const notifPanel = document.getElementById("notification-panel");

if (notifIcon && notifPanel) {
  notifIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent closing on icon click
    notifPanel.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!notifPanel.contains(e.target) && e.target !== notifIcon) {
      notifPanel.classList.add("hidden");
    }
  });
}

const profileTrigger = document.querySelector(".dropdown-trigger");
const profileDropdown = document.querySelector(".dropdown-panel");

if (profileTrigger && profileDropdown) {
  profileTrigger.addEventListener("click", () => {
    profileDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
      profileDropdown.classList.add("hidden");
    }
  });
}

// Handle all suggestion clicks (via delegation)
if (suggestions) {
  suggestions.addEventListener("click", (e) => {
    if (e.target.closest(".close-btn")) {
      suggestions.classList.add("hidden");
      return;
    }

    const item = e.target.closest(".suggestion-item");
    if (item && item.dataset.item) {
      window.location.href = `food.html?item=${item.dataset.item}`;
    }
  });
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = input.value.trim().toLowerCase();
      if (query) {
        window.location.href = `food.html?item=${query}`;
      }
    }
  });
}



  });
