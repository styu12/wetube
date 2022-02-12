const actionBtn = document.getElementById("actionBtn");
const preview = document.getElementById("preview");
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let stream;
let recorder;
let videoUrl;

const file = {
  input: "recording.webm",
  output: "myRecording.mp4",
  thumb: "thumbnail.jpg",
};
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 1024,
      height: 576,
    },
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
  actionBtn.innerText = "Recording...";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  setTimeout(() => {
    recorder.stop();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  }, 5000);
};

const handleStop = () => {
  recorder.stop();

  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/ffmpeg/ffmpeg-core.js",
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", file.input, await fetchFile(videoUrl));

  await ffmpeg.run("-i", file.input, "-r", "60", file.output);
  await ffmpeg.run(
    "-i",
    file.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    file.thumb
  );

  const mp4File = ffmpeg.FS("readFile", file.output);
  const thumbFile = ffmpeg.FS("readFile", file.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, file.output);
  downloadFile(thumbUrl, file.thumb);

  ffmpeg.FS("unlink", file.input);
  ffmpeg.FS("unlink", file.output);
  ffmpeg.FS("unlink", file.thumb);
  URL.revokeObjectURL(videoUrl);
  URL.revokeObjectURL(mp4Blob);
  URL.revokeObjectURL(thumbBlob);

  actionBtn.addEventListener("click", handleStart);
  actionBtn.innerText = "Record Again!";
  actionBtn.disabled = false;
};

actionBtn.addEventListener("click", handleStart);
