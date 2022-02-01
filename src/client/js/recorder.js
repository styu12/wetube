const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let videoUrl;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  preview.srcObject = stream;
  preview.play();
};
init();

const handleStart = () => {
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  recorder.ondataavailable = (e) => {
    videoUrl = URL.createObjectURL(e.data);
    preview.srcObject = null;
    preview.src = videoUrl;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
};

const handleStop = () => {
  recorder.stop();

  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
};

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoUrl;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

startBtn.addEventListener("click", handleStart);
