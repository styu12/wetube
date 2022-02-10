const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoControls = document.getElementById("videoControls");

const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeBar = document.getElementById("volume");
const timeBar = document.getElementById("timeBar");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let mouseLeaveTimeout = null;
let mouseStopTimeout = null;
let keydownTimeout = null;
let videoVolume = 0.5;
video.volume = videoVolume;

const styleInput = (input, color) => {
  const { value, min, max } = input;
  const valueRatio = (value / (max - min)) * 100;
  input.style.background = `linear-gradient(to right, ${color} ${valueRatio}%, transparent ${valueRatio}%)`;
};

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMute = () => {
  video.muted = !video.muted;
  muteIcon.classList = video.muted ? "fas fa-volume-up" : "fas fa-volume-mute";
  volumeBar.value = video.muted ? 0 : videoVolume;
};
const handleVolumeBar = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    handleMute();
  }
  videoVolume = value;
  video.volume = value;
  styleInput(volumeBar, "white");
};

const formatTime = (seconds) => {
  if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
};

const handleMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeBar.max = Math.floor(video.duration);
};
if (video.readyState >= 2) {
  handleMetaData();
}

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeBar.value = Math.floor(video.currentTime);
  styleInput(timeBar, "#ff3e37");
};

const handleTimeBar = (event) => {
  const isPlaying = !video.paused;
  if (isPlaying) video.pause();
  const {
    target: { value },
  } = event;
  video.currentTime = value;
  styleInput(timeBar, "#ff3e37");
  isPlaying ? video.play() : video.pause();
};

const handleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const endTimeout = () => {
  if (mouseLeaveTimeout) {
    clearTimeout(mouseLeaveTimeout);
  }
  if (mouseStopTimeout) {
    clearTimeout(mouseStopTimeout);
  }
  if (keydownTimeout) {
    clearTimeout(keydownTimeout);
  }
};

const handleMouseMove = () => {
  endTimeout();
  videoControls.classList.add("showing");
  mouseStopTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  mouseLeaveTimeout = setTimeout(hideControls, 3000);
};

const handleKeydown = (event) => {
  if (event.target.id === "commentTextarea") {
    return;
  }
  endTimeout();
  videoControls.classList.add("showing");
  keydownTimeout = setTimeout(hideControls, 3000);
  const { keyCode } = event;
  switch (keyCode) {
    case 39:
      video.currentTime += 1;
      break;
    case 37:
      video.currentTime -= 1;
      break;
    case 32:
      handlePlay();
      break;
    default:
      break;
  }
};

const handleEnded = () => {
  playIcon.classList = "fas fa-play";
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeBar.addEventListener("input", handleVolumeBar);
video.addEventListener("loadedmetadata", handleMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlay);
video.addEventListener("ended", handleEnded);
timeBar.addEventListener("input", handleTimeBar);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeydown);
