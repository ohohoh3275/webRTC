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

// issue: when server send back the messages that client sent,
// the code below cannot append elements nor even be triggered
// fixed: it just was a typo
socket.addEventListener("message", (message) => {
  console.log("message received")
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("close connection from server");
});

// setTimeout(() => {
//   // i needed to change this string to json by `makeMessage` function
//   // because when server get the datas and parse them,
//   // it errors out when it isnt JSON and implemented JSON.parse
//   socket.send(makeMessage("greeting", "good! how are you?"));
// }, 2000);

// issue: after sumbitting, it reloaded.
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // i tried with e.preventDefault; not e.preventDefault();
  // so it didnt really work, and issue i wrote above did come up
  const input = document.querySelector("input#message");
  console.log("input.value", input.value);
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
});

nicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("input#nickname");
  console.log("input.value", input.value);
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
});
