const socket = io();

const welcomeDiv = document.querySelector("#welcome")
const welcomeForm = document.querySelector("#welcome > form")
const chatRoomDiv = document.querySelector("#chatRoom");
const chatRoomForm = document.querySelector("#chatRoom > form")
const chatList = document.querySelector("#chatRoom > ul")

function renderChatRoom(roomName) {
    welcomeDiv.style.display = "none";
    chatRoomDiv.style.display = "block"
    const roomTitle = document.createElement('h2')
    roomTitle.innerText = `Room name: ${roomName}`;
    chatRoomDiv.appendChild(roomTitle)
}

function addMessage(message) {
    const li = document.createElement("li");
    li.innerText = message;
    chatList.append(li);
}

welcomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#welcomeInput");
    socket.emit("enter_room", input.value, renderChatRoom);
    input.value = "";
})

socket.on("welcome", () => {
    addMessage("someone joined!")
})
