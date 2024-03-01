import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  socket.send("hi client! how are you?");
  socket.on("close", () => console.log("disconnected from browser"));
  socket.on("message", (msg) => {
    console.log(msg, "server");
    socket.send(msg);
  });
});

server.listen(3000, () => console.log(`listening on 3000`));
