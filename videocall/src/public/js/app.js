const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraOffBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameraSelect");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let isMuted = false;
let isCameraOff = false;
let roomName = "";

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
        getCameras();
    } catch(e) {
        console.log(e)
    }
    
}


muteBtn.addEventListener("click", () => {
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


// welcome code
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}

welcomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    input.value = "";
})



// socket code

socket.on("welcome", () => {
    console.log("someone joined")
})