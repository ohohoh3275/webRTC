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
let myPeerConnection;

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
        myFace.srcObject = await myStream
        await getCameras();
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

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    await makeConnection();
}

welcomeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = await welcomeForm.querySelector("input");
    await startMedia();
    await socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
})

// socket code
// client: welcome && send offer -> server: welcome && receive offer 
// -> server: send offer to roomName 
// -> client: receive offer from roomName && send answer to roomName && set remote and local description
// -> server: receive answer from roomName && send answer -> client: recieve answer && set remote description
socket.on("welcome", async () => {
    // this code runs only for `first` of the chatroom
    console.log("someone joined")
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log('send offer', offer);
    socket.emit("offer", offer, roomName)
})

socket.on("offer", async (offer) => {
    // this code runs only for `second` of the chatroom
    console.log('receive offer', offer);
    await myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    await myPeerConnection.setLocalDescription(answer);
    await socket.emit("answer", answer, roomName)
})

socket.on("answer", (answer) => { 
    myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", (ice) => {
    console.log('receive candidate')
    myPeerConnection.addIceCandidate(ice);
})

// RTC 
function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    
    // ICE candidate
    myPeerConnection.addEventListener("icecandidate", (data) => {
        console.log('sent candidate')
        socket.emit("ice", data.candidate, roomName);
    })

    // add stream
    myPeerConnection.addEventListener("addstream", (data) => {
        const peersStream = document.getElementById("peersStream")
        peersStream.srcObject = data.stream
    })
    
    // my stream (video and voice) goes to peer connection
    myStream.getTracks().forEach((track) => {
        myPeerConnection.addTrack(track, myStream);
    })
}