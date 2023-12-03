import "./video.css";
import { useRef, useState } from "react";

function Video() {
  console.log("video component run");
  //
  const [status, setStatus] = useState();
  const showLiveVideo = useRef();
  const showRecordedVideo = useRef();

  const recoredBlobs = useRef([]);

  //
  //

  async function handleStartCamera() {
    const constraints = {
      audio: {
        echoCancellation: { exact: true },
      },
      video: {
        width: 1280,
        height: 720,
      },
    };

    let options = {
      mimeType: "video/webm",
    };

    let options2 = {
      type: "video/webm",
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log("stream", stream);

      window.stream = stream;

      if (stream) {
        showLiveVideo.current.srcObject = stream;
      }

      let mediaRecorder = new MediaRecorder(stream, options);

      console.log("mediaRecorder", mediaRecorder);

      mediaRecorder.start();
      console.log("mediaRecorder start");

      setTimeout(() => {
        mediaRecorder.pause();
        console.log("mediaRecorder pause : recoredBlobs", recoredBlobs.current);
      }, 4000);

      setTimeout(() => {
        mediaRecorder.resume();
        console.log("mediaRecorder resume : recoredBlobs", recoredBlobs.current);
      }, 8000);

      setTimeout(() => {
        mediaRecorder.stop();
        console.log("mediaRecorder stop : recoredBlobs", recoredBlobs.current);
      }, 10000);

      mediaRecorder.ondataavailable = (e) => {
        console.log("mediaRecorder ondataavailable", e);
        recoredBlobs.current.push(e.data);

        const superBuffer = new Blob(recoredBlobs.current, options2);

        console.log(
          "mediaRecorder ondataavailable : recoredBlobs",
          recoredBlobs.current
        );
        console.log("mediaRecorder ondataavailable : superBuffer", superBuffer);

        showRecordedVideo.current.src = URL.createObjectURL(superBuffer);
      };

      mediaRecorder.onstop = (e) => {
        console.log("mediaRecorder onstop", e);

        if (stream) {
          console.log("mediaRecorder onstop : stream", stream);
          const tracks = stream.getTracks();

          console.log("tracks", tracks);
          tracks.forEach((track) => track.stop());
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  function handleStartRecording() {
    setStatus("record");
  }
  function handleStopRecording() {}
  function handleDownload() {}

  return (
    <>
      <button onClick={handleStartCamera}>Start Camera</button>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <button onClick={handleDownload}>Download</button>

      <div className="show-live-video-container">
        <video src="" ref={showLiveVideo} playsInline autoPlay></video>
      </div>
      <div className="show-recorded-video-container">
        <video src="" ref={showRecordedVideo} playsInline controls></video>
      </div>
    </>
  );
}

export default Video;
