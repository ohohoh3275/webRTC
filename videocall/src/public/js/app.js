const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraOffBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameraSelect");

let myStream;
let isMuted = false;
let isCameraOff = false;

async function getCameras() {
    try {
        const devices =  await navigator.mediaDevices.enumerateDevices();
        await console.log(devices)
        const cameras = await devices.filter((device) => {
            return device.kind === "videoinput";
        });

        await cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            cameraSelect.appendChild(option)
        })
    } catch(e) {
        console.log(e)
    }
}

async function getMedia() {

    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        myFace.srcObject = myStream
    } catch(e) {
        console.log(e)
    }

}

getMedia()
getCameras()

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