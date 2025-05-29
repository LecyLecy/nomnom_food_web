document.addEventListener("DOMContentLoaded", () => {
    const faqQuestions = document.querySelectorAll(".faq-question");
  
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const answer = question.parentElement.querySelector(".faq-answer");
        const icon = question.querySelector(".faq-toggle-icon");
  
        const isHidden = answer.classList.contains("hidden");
        answer.classList.toggle("hidden");
  
        // Swap icon
        icon.src = isHidden ? "/assets/negative.svg" : "/assets/positive.svg";
        icon.alt = isHidden ? "Collapse" : "Expand";
      });
    });
  });
  