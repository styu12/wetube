const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeBar = document.getElementById("volume");
const timeBar = document.getElementById("timeBar");

let videoVolume = 0.5;
video.volume = videoVolume;

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};
const handleMute = () => {
  video.muted = !video.muted;
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
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

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeBar.value = Math.floor(video.currentTime);
};

const handleTimeBar = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeBar.addEventListener("input", handleVolumeBar);
video.addEventListener("loadedmetadata", handleMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeBar.addEventListener("input", handleTimeBar);
