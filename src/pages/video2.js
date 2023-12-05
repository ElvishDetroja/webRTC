import { useState, useEffect, useRef } from "react";
import "./video2.css"

function Video2() {
    const [stream, setStream] = useState();
    const [recorder, setRecorder] = useState();
    const liveVideo = useRef();
    const recordedVideo = useRef();

    const [feature, setFeature] = useState({});

    function handleCamerafacingMode() {
        setFeature((pre) => { return { ...pre, facingMode: !pre.facingMode } })
    }



    function mediaRecorderCallback(mediaRecorder) {

        mediaRecorder.onstart = () => {
            console.log("MR onstart run");
            liveVideo.current.play();
        }

        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            console.log("MR ondataavailable run");
            chunks.push(e.data);
        }

        mediaRecorder.onstop = () => {
            console.log("MR onstop run");

            const blob = new Blob(chunks, blobOption);
            const blobURL = URL.createObjectURL(blob);

            liveVideo.current.srcObject = null;
            recordedVideo.current.src = blobURL;
        }
    }

    const constraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
        }, video: {
            // width: 1280, height: 720,
            facingMode: feature.facingMode ? "environment" : "user"
        }
    }

    const blobOption = {
        type: "video/webm"
    }

    useEffect(() => {
        if (stream) {
            console.log("stream set to liveVideo");
            liveVideo.current.srcObject = stream;
        }
    }, [stream]);

    async function startRecording() {
        console.log("btn start recording");
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                constraints
            );
            setStream(stream);
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            mediaRecorderCallback(mediaRecorder);
            mediaRecorder.start();
        }
        catch (err) {
            console.log("err in startRecording", err);
        }
    }


    async function stopRecording() {
        if (recorder) {
            recorder.stop();
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }
    }


    useEffect(() => {

        async function getNumberOfCameras() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputDevices = devices.filter(device => device.kind === 'videoinput');

                setFeature((pre) => { return { ...pre, numberOfCamera: videoInputDevices.length } })
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }
        }

        getNumberOfCameras();

    }, []);




    useEffect(() => {

        const permissionsArray = [
            'camera',
            'microphone',
            // 'geolocation',
            // 'notifications',
            // 'push',
            // 'bluetooth',
            // 'midi',
            // 'clipboard-read',
            // 'clipboard-write',
            // 'background-sync',
            // 'payment-handler',
            // 'idle-detection',
        ];


        async function checkAllPermissions() {
            try {
                const permissionStatusArray = await Promise.all(
                    permissionsArray.map(async permission => {
                        const permissionStatus = await navigator.permissions.query({ name: permission });
                        permissionStatus.permissionName = permission;
                        return permissionStatus;
                    })
                );

                console.log("permissionStatusArray", permissionStatusArray);
                setFeature((pre) => { return { ...pre, permissions: permissionStatusArray } })
                // state : prompt, granted, denied
            } catch (error) {
                console.error('Error checking permissions:', error);
            }
        }
        checkAllPermissions();
    }, []);

    console.log(feature);


    // const permissionResult = await navigator.permissions.request({ name: "camera" });

    async function handleAskPermission() {


        Geolocation.requestPermission(function(result) {
    if (result === 'denied') {
    console.log('Permission wasn\'t granted. Allow a retry.');
    return;
    } else if (result === 'default') {
    console.log('The permission request was dismissed.');
    return;
    }
    console.log('Permission was granted for notifications');
});

    }



    return (
        <div>
            <button onClick={startRecording}>start</button>
            <button onClick={stopRecording}>stop</button>
            <button onClick={handleCamerafacingMode}>change camera mode</button>
            <button onClick={handleAskPermission}>permission</button>
            <div className="video-container">
                <video src="" ref={liveVideo}></video>
                <video src="" ref={recordedVideo} controls></video>
            </div>
        </div>
    )
}

export default Video2;
