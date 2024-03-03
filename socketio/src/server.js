import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (roomName, fn) => {
        console.log(socket.rooms)
        socket.join(roomName)
        console.log(socket.rooms)
        setTimeout(() => {
           fn("it's done!"); // sent from browser and running on browser too
        }, 3000);
    })
})

httpServer.listen(3000, () => console.log(`listening on 3000`));
