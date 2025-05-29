document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const suggestions = document.getElementById("search-suggestions");
    const closeBtn = suggestions.querySelector(".close-btn");
  
    input.addEventListener("focus", () => {
      suggestions.classList.remove("hidden");
    });
  
    closeBtn.addEventListener("click", () => {
      suggestions.classList.add("hidden");
    });
  });
  