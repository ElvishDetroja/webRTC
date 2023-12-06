import { useRef, useState } from "react";
import { MR } from "./video3Class";
import "./video2.css";

//
//
//

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
  video: {
    // width: 1280,
    // height: 720,
    // facingMode: feature.facingMode ? "environment" : "user",
    facingMode: "user",
  },
};

const blobOption = {
  type: "video/webm",
};

function Video3() {
  //
  const liveVideo = useRef();
  const recordedVideo = useRef();

  const timer = useRef();

  const [status, setStatus] = useState(0);

  async function handleStatrtCamera() {
    try {
      MR.clearStream();
      const stream = await MR.startStream(constraints);
      liveVideo.current.controls = false;
      liveVideo.current.srcObject = stream;
      liveVideo.current.play();
      setStatus(1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStartRecording() {
    try {
      await MR.recordStream(blobOption);
      updateTimer(timer.current);
      setStatus(2);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStopRecording() {
    try {
      stopTimer();
      const { blob, blobURL } = await MR.stopStream();
      setStatus(3);
      liveVideo.current.srcObject = null;
      recordedVideo.current.controls = true;
      recordedVideo.current.src = blobURL;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDevices() {
    try {
      const devices = await MR.devices();
      console.log("devices", devices);
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePermissions() {
    try {
      const permissions = await MR.permissions(handlePermissions);
      console.log("permissions", permissions);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRecordClick() {
    try {
      if (status == 0 || status == 1) {
        MR.clearStream();
        const stream = await MR.startStream(constraints);
        liveVideo.current.controls = false;
        liveVideo.current.srcObject = stream;
        liveVideo.current.play();
        await MR.recordStream(blobOption);
        updateTimer(timer.current);
        setStatus(2);
      }

      if (status == 2) {
        stopTimer();
        const { blob, blobURL } = await MR.stopStream();
        setStatus(3);
        liveVideo.current.srcObject = null;
        recordedVideo.current.controls = true;
        recordedVideo.current.src = blobURL;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <button onClick={handleStatrtCamera}>start camera</button>
      <button onClick={handleStartRecording}>start recording</button>
      <button onClick={handleStopRecording}>stop recording</button>
      <button onClick={handlePermissions}>check permissions</button>
      <button onClick={handleDevices}>devices</button>

      <div
        className={`video-container ${
          status !== 3 ? "live-show" : "recorded-show"
        }`}
      >
        <div className="live-video-container">
          <video src="" ref={liveVideo} className="live-video"></video>

          <div
            className={`record-button ${status == 2 && "active"}`}
            onClick={handleRecordClick}
          ></div>

          <div className={`record-indicator ${status == 2 && "active"}`}>
            <div className="circle"></div>
            <div className="record-timer" ref={timer}>
              00:00
            </div>
          </div>
        </div>

        <div className="recorded-video-container">
          <video src="" ref={recordedVideo} className="recorded-video"></video>
        </div>
      </div>

    
    </>
  );
}

export default Video3;
