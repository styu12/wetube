const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

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

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/ffmpeg/ffmpeg-core.js",
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoUrl));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "thumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();
};

startBtn.addEventListener("click", handleStart);
