fetch("data/comments.json")
  .then(res => res.json())
  .then(comments => {
    const commentList = document.getElementById("comment-list");
    const postBtn = document.getElementById("post-comment");
    const commentField = document.getElementById("comment-field");

    let sessionLikes = {};
    let replyBoxes = {};

    function createComment(comment) {
      const wrapper = document.createElement("div");
      wrapper.className = "comment";

      wrapper.innerHTML = `
        <img src="assets/${comment.avatar}" alt="${comment.username}" class="comment-avatar" />
        <div class="comment-content">
          <p><strong>${comment.username}</strong></p>
          <p>${comment.text}</p>
          <div class="comment-actions">
            <span class="like" data-id="${comment.id}">
              <img src="assets/Thumbs Up.svg" alt="Like"> <span>${comment.likes}</span>
            </span>
            <span class="dislike" data-id="${comment.id}">
              <img src="assets/Thumbs Down.svg" alt="Dislike"> <span>${comment.dislikes}</span>
            </span>
            <span class="reply-btn" data-id="${comment.id}">Reply</span>
          </div>
          <div class="reply-container" id="reply-container-${comment.id}"></div>
        </div>
      `;

      // Replies
      comment.replies.forEach(reply => {
        const replyEl = document.createElement("div");
        replyEl.className = "comment reply";
        replyEl.innerHTML = `
          <img src="assets/${reply.avatar}" alt="${reply.username}" class="comment-avatar" />
          <div class="comment-content">
            <p><strong>${reply.username}</strong></p>
            <p>${reply.text}</p>
          </div>
        `;
        wrapper.querySelector(`#reply-container-${comment.id}`).appendChild(replyEl);
      });

      // Like
      wrapper.querySelector(".like").addEventListener("click", () => {
        const id = comment.id;
        const likeSpan = wrapper.querySelector(".like span");
        const img = wrapper.querySelector(".like img");

        if (sessionLikes[id] === "like") {
          comment.likes--;
          sessionLikes[id] = null;
          img.src = "assets/Thumbs Up.svg";
        } else {
          if (sessionLikes[id] === "dislike") {
            comment.dislikes--;
            wrapper.querySelector(".dislike img").src = "assets/Thumbs Down.svg";
            wrapper.querySelector(".dislike span").textContent = comment.dislikes;
          }
          comment.likes++;
          sessionLikes[id] = "like";
          img.src = "assets/Thumbs Up (1).svg";
        }

        likeSpan.textContent = comment.likes;
      });

      // Dislike
      wrapper.querySelector(".dislike").addEventListener("click", () => {
        const id = comment.id;
        const dislikeSpan = wrapper.querySelector(".dislike span");
        const img = wrapper.querySelector(".dislike img");

        if (sessionLikes[id] === "dislike") {
          comment.dislikes--;
          sessionLikes[id] = null;
          img.src = "assets/Thumbs Down.svg";
        } else {
          if (sessionLikes[id] === "like") {
            comment.likes--;
            wrapper.querySelector(".like img").src = "assets/Thumbs Up.svg";
            wrapper.querySelector(".like span").textContent = comment.likes;
          }
          comment.dislikes++;
          sessionLikes[id] = "dislike";
          img.src = "assets/Thumbs Down (1).svg";
        }

        dislikeSpan.textContent = comment.dislikes;
      });

      // Reply
      wrapper.querySelector(".reply-btn").addEventListener("click", () => {
        const container = wrapper.querySelector(`#reply-container-${comment.id}`);

        if (replyBoxes[comment.id]) return;

        const box = document.createElement("div");
        box.className = "reply-box";
        box.innerHTML = `
          <img src="assets/profile_picture.jpg" class="comment-avatar" />
          <div class="reply-controls" style="flex: 1;">
            <input type="text" class="reply-input" placeholder="Write a reply..." />
            <div class="reply-controls">
              <button class="post-reply">Post</button>
              <button class="cancel-reply">Cancel</button>
            </div>
          </div>
        `;

        container.appendChild(box);
        replyBoxes[comment.id] = true;

        box.querySelector(".cancel-reply").onclick = () => {
          box.remove();
          delete replyBoxes[comment.id];
        };

        box.querySelector(".post-reply").onclick = () => {
          const val = box.querySelector(".reply-input").value.trim();
          if (!val) return;

          const replyEl = document.createElement("div");
          replyEl.className = "comment reply";
          replyEl.innerHTML = `
            <img src="assets/profile_picture.jpg" class="comment-avatar" />
            <div class="comment-content">
              <p><strong>Adin</strong></p>
              <p>${val}</p>
            </div>
          `;
          container.appendChild(replyEl);
          box.remove();
          delete replyBoxes[comment.id];
        };
      });

      return wrapper;
    }

    // Initial render
    comments.forEach(c => {
      commentList.appendChild(createComment(c));
    });

    // Post main comment
    postBtn.addEventListener("click", () => {
      const val = commentField.value.trim();
      if (!val) return;

      const newComment = {
        id: Date.now(),
        username: "Adin",
        avatar: "profile_picture.jpg",
        text: val,
        likes: 0,
        dislikes: 0,
        replies: []
      };

      const commentEl = createComment(newComment);
      commentList.appendChild(commentEl);
      commentField.value = "";
    });
  });