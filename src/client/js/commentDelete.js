const comments = document.querySelectorAll(".comment");
const videoContainer = document.getElementById("videoContainer");
const commentContainer = document.querySelector(".commentContainer");

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
    deleteBtn.addEventListener("click", () => handleDelete(event, id));
  }
}
