// ===================
// 1. Food Data Setup
// ===================
const foodData = {
  egg: {
    name: "Egg",
    tags: ["Simple", "Protein", "Breakfast"],
    image: "assets/egg.png",
    time: "10 mins",
    calories: "155 cal",
    benefits: ["High protein", "Quick to cook"],
  },
  salad: {
    name: "Salad",
    tags: ["Diet", "Fresh", "Simple"],
    image: "assets/salad.png",
    time: "15 mins",
    calories: "120 cal",
    benefits: ["Low calorie", "Rich in fiber"],
  }
};

// ============================
// 2. Load Selected Food Data
// ============================
const params = new URLSearchParams(window.location.search);
const item = params.get("item");

if (item && foodData[item]) {
  const data = foodData[item];

  document.getElementById("food-title").textContent = data.name;
  document.getElementById("food-image").src = data.image;
  document.getElementById("food-time").textContent = data.time;
  document.getElementById("food-calories").textContent = data.calories;

  const tagBox = document.getElementById("food-tags");
  data.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    tagBox.appendChild(span);
  });

  const benefitList = document.getElementById("food-benefits");
  data.benefits.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    benefitList.appendChild(li);
  });

  document.getElementById("store-link").href = `https://www.google.com/maps/search/nearest+${data.name}+store`;
}

// ===========================
// 3. Favorite Toggle Feature
// ===========================
const favIcon = document.getElementById("fav-icon");
let isFavorite = false;
favIcon.addEventListener("click", () => {
  isFavorite = !isFavorite;
  favIcon.src = isFavorite ? "assets/red_heart.svg" : "assets/heart.svg";
});

// ===============================
// 4. Like/Dislike Button Logic
// ===============================
function initLikeDislike(container) {
  const likeBtn = container.querySelector(".like-btn img");
  const dislikeBtn = container.querySelector(".dislike-btn img");
  const likeCount = container.querySelector(".like-count");
  const dislikeCount = container.querySelector(".dislike-count");

  let liked = false;
  let disliked = false;

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likeBtn.src = liked ? "assets/Thumbs Up (1).svg" : "assets/Thumbs Up.svg";
    likeCount.textContent = parseInt(likeCount.textContent) + (liked ? 1 : -1);
  });

  dislikeBtn.addEventListener("click", () => {
    disliked = !disliked;
    dislikeBtn.src = disliked ? "assets/Thumbs Down (1).svg" : "assets/Thumbs Down.svg";
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + (disliked ? 1 : -1);
  });
}

// ==============================
// 5. Comment + Reply Rendering
// ==============================
const commentList = document.getElementById("comment-list");
const comments = [
  {
    user: "Lebron",
    text: "This recipe changed my breakfast forever!",
    likes: 25,
    dislikes: 2,
    replies: [
      { user: "Chaewon",text: "Same here!", likes: 5, dislikes: 0 }
    ]
  },
  {
    user: "Kairi",
    text: "So quick and easy!",
    likes: 12,
    dislikes: 1,
    replies: []
  }
];

function renderComment({ user, text, likes, dislikes, replies = [] }, isReply = false) {
  const commentEl = document.createElement("div");
  commentEl.className = isReply ? "comment reply" : "comment";

  const avatarMap = {
    "Lebron": "assets/lebron.jpg",
    "Kairi": "assets/kairi.jpg",
    "Adin": "assets/profile_picture.jpg",
    "Chaewon": "assets/chaewon.jpeg",
  };
  const avatar = avatarMap[user] || "assets/profile_picture.jpg";

  commentEl.innerHTML = `
    <img src="${avatar}" class="comment-avatar" />
    <div class="comment-content">
      <p><strong>${user}</strong></p>
      <p>${text}</p>
      <div class="comment-actions">
        <span class="like-btn">
          <img src="assets/Thumbs Up.svg" alt="like" />
          <span class="like-count">${likes}</span>
        </span>
        <span class="dislike-btn">
          <img src="assets/Thumbs Down.svg" alt="dislike" />
          <span class="dislike-count">${dislikes}</span>
        </span>
        ${!isReply ? '<span class="reply-btn">Reply</span>' : ''}
      </div>
    </div>
  `;

  commentList.appendChild(commentEl);
  initLikeDislike(commentEl);

  // Reply toggle for top-level comments
  if (!isReply) {
    const replyBtn = commentEl.querySelector(".reply-btn");
    replyBtn.addEventListener("click", () => {
      if (commentEl.querySelector(".reply-box")) return; // already open

      const box = document.createElement("div");
      box.className = "reply-box";
      box.innerHTML = `
        <img src="assets/profile_picture.jpg" class="comment-avatar" />
        <div style="flex: 1">
          <input class="reply-input" placeholder="Write a reply..." />
          <div class="reply-controls">
            <button class="post-reply">Post</button>
            <button class="cancel-reply">Cancel</button>
          </div>
        </div>
      `;
      commentEl.appendChild(box);

      const input = box.querySelector(".reply-input");
      const postBtn = box.querySelector(".post-reply");
      const cancelBtn = box.querySelector(".cancel-reply");

      postBtn.addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return;
        renderComment({ user: "Adin", text: val, likes: 0, dislikes: 0 }, true);
        commentEl.removeChild(box);
      });

      cancelBtn.addEventListener("click", () => commentEl.removeChild(box));
    });
  }

  // Render replies if any
  replies.forEach(reply => {
    renderComment(reply, true);
  });
}

comments.forEach(c => renderComment(c));

// ============================
// 6. New Top-Level Comment
// ============================
const postBtn = document.getElementById("post-comment");
const commentField = document.getElementById("comment-field");

postBtn.addEventListener("click", () => {
  const text = commentField.value.trim();
  if (!text) return;

  renderComment({ user: "Adin", text, likes: 0, dislikes: 0 });
  commentField.value = "";
});
