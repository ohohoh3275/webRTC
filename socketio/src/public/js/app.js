const socket = io();

const welcome = document.querySelector("#welcome")
const form = document.querySelector("form")

function sendToServer(text) {
    console.log(`server said : "${text}"`)
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("input");
    // custom event name: enter_room
    socket.emit("enter_room", input.value, sendToServer);
    input.value = "";
})