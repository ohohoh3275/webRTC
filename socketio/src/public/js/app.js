const socket = io();

const welcome = document.querySelector("#welcome")
const form = document.querySelector("form")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("input");
    // custom event name: enter_room
    socket.emit("enter_room", { payload: input.value }, () => {
        console.log("this function itself is going to server")
    })
    input.value = "";
})