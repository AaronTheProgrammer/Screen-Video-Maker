window.api.getScreen();
let chunks = [];
let mediaStream = null;
let recorder = null;
let seconds = 0;
let videoNumber = 1;
let filename = "";
let videoLink = document.getElementById("downloadLink");
let videoURL = "";
let myInterval = null;


async function setupMediaStream() {
    // create audio and video constraints
    const constraintsVideo = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop'
            }
        }
    };
    const constraintsAudio = {
        audio: true
    };

    // create audio and video streams separately
    const audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio);
    const videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo);

    // combine the streams 
    mediaStream = new MediaStream([...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()]);
    recorder = new MediaRecorder(mediaStream);
    recorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
    });
    recorder.onstop = function () {
        let mostRecentChunk = [];
        mostRecentChunk.push(chunks[chunks.length - 1]);
        let blob = new Blob(mostRecentChunk, { 'type': 'video/mp4' });
        videoURL = window.URL.createObjectURL(blob);
        document.getElementById("recordingTime").innerHTML = "";
        seconds = 0;
        document.getElementById("recording").value = 0;
        document.getElementById("record").innerHTML = "Start Recording";
        let video = document.createElement("video");
        video.src = videoURL;
        video.controls = true;
        video.style.width = "400px";
        video.style.height = "400px";
        document.getElementById("videoItself").appendChild(video);
    };
}

setupMediaStream();

function playOrPause() {
    const recording = parseInt(document.getElementById("recording").value);
    recording == 0 ? record() : pause();
}

function record() {
    if (recorder != null) {
        if (recorder.state == "inactive") {
            recorder.start();
        } else if (recorder.state == "paused") {
            recorder.resume();
        }
        myInterval = setInterval(countTime, 1000);
        document.getElementById("recording").value = 1;
        document.getElementById("record").innerHTML = "Pause";
        cancelDownload();
    } else {
        console.log("You must grant permission for the app to share your screen and use your microphone");
    }
}

function pause() {
    if (recorder != null) {
        recorder.pause();
        clearInterval(myInterval);
        document.getElementById("recording").value = 0;
        document.getElementById("record").innerHTML = "Continue Recording";
        let timeLabel = document.getElementById("recordingTime").innerHTML;
        document.getElementById("recordingTime").innerHTML = "" + recorder.state + ": " + timeLabel.substring(timeLabel.indexOf(":") + 1, timeLabel.length);
    } else {
        console.log("You must grant permission for the app to share your screen and use your microphone");
    }
}

function stopRecording() {
    if (recorder != null) {
        if (recorder.state != "inactive") {
            recorder.stop();
            document.getElementById("save").disabled = false;
            document.getElementById("cancel").disabled = false;
            clearInterval(myInterval);
        }
    } else {
        console.log("You must grant permission for the app to share your screen and use your microphone");
    }
}

function countTime() {
    seconds++;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    let secs = seconds - (hours * 3600) - (minutes * 60);
    let hourString = "";
    if (hours < 10) {
        hourString += "0";
    }
    hourString += hours;
    let minuteString = "";
    if (minuteString < 10) {
        minuteString += "0";
    }
    minuteString += minutes;
    let secString = "";
    if (secs < 10) {
        secString += "0";
    }
    secString += secs;
    let timeString = hourString + ":" + minuteString + ":" + secString;
    document.getElementById("recordingTime").innerHTML = "" + recorder.state + ": " + timeString;
}

function download() {
    filename = "video " + videoNumber + ".mp4";
    videoNumber++;
    videoLink.setAttribute("href", videoURL);
    videoLink.setAttribute("download", filename);
    document.getElementById("endRecording").click();
    videoLink.removeAttribute("download");
    videoLink.removeAttribute("href");
}

function cancelDownload() {
    document.getElementById("videoItself").innerHTML = "";
    document.getElementById("save").disabled = true;
    document.getElementById("cancel").disabled = true;
}
