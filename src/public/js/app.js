// reason why i didnt import from 'ws' is JS itself support WebSocket
// https://developer.mozilla.org/ko/docs/Web/API/WebSocket
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to browser : ws");
});

socket.addEventListener("message", (message) => {
  console.log(">>> message: ", message.data, "from the Server");
});

socket.addEventListener("close", () => {
  console.log("close connection from server");
});

setTimeout(() => {
  socket.send("good! how are you?");
}, 100000);
