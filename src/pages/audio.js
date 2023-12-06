import { useRef, useState } from "react";
import microphone from "./../images/microphone.svg";
import "./audio.css";
import { MR } from "./video3Class";

let timerInterval;

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const timeComponents = [
    minutes < 10 ? `0${minutes}` : `${minutes}`,
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`,
  ];

  return timeComponents.join(":");
}

function updateTimer(timer) {
  let secondsElapsed = 0;

  timerInterval = setInterval(() => {
    secondsElapsed++;
    timer.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

const blobOption = {
  type: "audio/wav",
};

function Audio() {
  const timer = useRef();
  const [status, setStatus] = useState(0);
  const audio = useRef();

  async function startAudioRecord() {
    try {
      MR.clearStream();
      await MR.startStream(constraints);
      await MR.recordStream(blobOption);
      updateTimer(timer.current);
    } catch (error) {
      console.log(error);
    }
  }

  async function stopAudioRecord() {
    try {
      stopTimer();
      const { blob, blobURL } = await MR.stopStream();
      audio.current.src = blobURL;
    } catch (error) {
      console.log(error);
    }
  }

  function handleAudioClick() {
    if (status == 0) {
      startAudioRecord();
      setStatus(1);
    }
    if (status == 1) {
      stopAudioRecord();
      setStatus(2);
    }
    if (status == 2) {
      startAudioRecord();
      setStatus(1);
    }
  }

  return (
    <div className="audio-recorder-container">
      <div className={`audio-recorder-cover  ${status == 1 && "active"}`}>
        <div
          className="audio-recorder"
          onClick={handleAudioClick}
        >
          <img src={microphone} alt="" />
        </div>
        <div className="timer" ref={timer}></div>
      </div>

      <div className={`audio-show-container ${status == 2 && "show"}`}>
        <audio src="" controls ref={audio}></audio>
      </div>
    </div>
  );
}

export default Audio;
