const tags = document.querySelectorAll(".filter");
const tagInput = document.getElementById("tagInput");
const tagForm = document.getElementById("tagForm");

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const tag = params.get("hashtag");

window.onload = () => {
    if(tag) {
        tags.forEach((t) => {
            if(t.innerText == tag) {
                t.className = 'filter active';
            }   else {
                t.className = 'filter';
            }
        })
    }
}

const handleTag = (event) => {
    const {target} = event;
    tagInput.value = target.innerText;
    tagForm.submit();
}


tags.forEach((tag) => {
    tag.addEventListener("click", handleTag)
});
