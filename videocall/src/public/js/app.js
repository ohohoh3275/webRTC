const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraOffBtn = document.getElementById("camera");

let myStream;
let isMuted = false;
let isCameraOff = false;


async function getMedia() {

    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        console.log(myStream)
        myFace.srcObject = myStream
    } catch(e) {
        console.log(e)
    }

}

getMedia()

muteBtn.addEventListener("click", () => {
    console.log(myStream.getAudioTracks())
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
    })
    if(isMuted) {
        muteBtn.innerText = "Unmute";
        isMuted = false;
    } else {
        muteBtn.innerText = "Mute";
        isMuted = true;
    }
});

cameraOffBtn.addEventListener("click", () => {
    console.log(myStream.getVideoTracks())
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
    })
    if(isCameraOff) {
        cameraOffBtn.innerText = "CameraOn";
        isCameraOff = false;
    } else {
        cameraOffBtn.innerText = "CameraOff";
        isCameraOff = true;
    }
})