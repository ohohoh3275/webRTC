// reason why i didnt import from 'ws' is JS itself support WebSocket
// https://developer.mozilla.org/ko/docs/Web/API/WebSocket
const socket = new WebSocket(`ws://${window.location.host}`);

const nicknameForm = document.querySelector("#nicknameForm");
const messageForm = document.querySelector("#messageForm");
const messageBtn = document.querySelector("#messageBtn");
const nicknameBtn = document.querySelector("#nicknameBtn");

const messageList = document.querySelector("ul");

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("connected to browser : ws");
});

socket.addEventListener("message", (message) => {
  console.log(">>> message: ", message.data, " from the Server");
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("close connection from server");
});

setTimeout(() => {
  socket.send("good! how are you?");
}, 2000);

// issue: after sumbitting, it reloaded.
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // i tried with e.preventDefault; not e.preventDefault();
  // so it didnt really work, and issue i wrote above did come up
  const input = document.querySelector("input#message");
  console.log("new message", input.value);
  socket.send(makeMessage("new_msaage", input.value));
  input.value = "";
});

nicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("input#nickname");
  socket.send(makeMessage("nickname", input.value));
});
