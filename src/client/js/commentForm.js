const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const comments = document.querySelectorAll(".comment");

// const commentContainer = document.querySelector(".commentContainer");

const addComment = (text, id) => {
  const commentContainer = document.querySelector(".commentContainer > ul");

  const newComment = document.createElement("li");
  newComment.className = "comment";
  newComment.dataset.id = id;

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "deleteBtn";
  deleteSpan.innerText = " ❌";
  deleteSpan.addEventListener("click", () => handleDelete(event, id));
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteSpan);

  commentContainer.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { commentId } = await response.json();
    addComment(text, commentId);
  }

  textarea.value = "";
};

btn.addEventListener("click", handleSubmit);

const handleDelete = async (event, id) => {
  const ok = confirm("Are you sure to delete this comment?");
  if (!ok) {
    return;
  }
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comment/${id}/delete`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    const {
      target: { parentElement },
    } = event;
    parentElement.remove();
  }
};

for (let comment of comments) {
  const {
    dataset: { id },
  } = comment;
  const deleteBtn = comment.querySelector(".deleteBtn");
  if (deleteBtn) {
    // deleteBtn.removeEventListener("click", () => handleDelete(event, id));
    deleteBtn.addEventListener("click", () => handleDelete(event, id));
  }
}
