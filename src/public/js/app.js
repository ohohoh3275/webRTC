// reason why i didnt import from 'ws' is JS itself support WebSocket
// https://developer.mozilla.org/ko/docs/Web/API/WebSocket
const socket = new WebSocket(`ws://${window.location.host}`);

// const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#textForm");
const submitButton = document.querySelector("#msgBtn");

socket.addEventListener("open", () => {
  console.log("connected to browser : ws");
});

socket.addEventListener("message", (message) => {
  console.log(">>> message: ", message.data, " from the Server");
});

socket.addEventListener("close", () => {
  console.log("close connection from server");
});

// setTimeout(() => {
//   socket.send("good! how are you?");
// }, 100000);

// issue: after sumbitting, it reloaded.
// messageForm.addEventListener("submit", (e) => {
//   e.preventDefault;
//   const input = document.querySelector("input");
//   console.log("new message", input.value);
//   socket.send(input.value);
//   input.value = "";
// });

// it works with button tho
submitButton.addEventListener("click", (e) => {
  e.preventDefault;
  const input = document.querySelector("input");
  console.log("new message", input.value);
  socket.send(input.value);
  input.value = "";
});
