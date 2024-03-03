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
    socket.onAny((e) => {
        console.log(wsServer.sockets.adapter)
        /**
         * <ref *2> Adapter {
            _events: [Object: null prototype] {},
            _eventsCount: 0,
            _maxListeners: undefined,
            nsp: <ref *1> Namespace {
                _events: [Object: null prototype] { connection: [Function (anonymous)] },
                _eventsCount: 1,
                _maxListeners: undefined,
                sockets: Map(3) {
                'KhpqgPcvFej_fKvtAAAD' => [Socket],
                '4Q5T601u2cg7QhlnAAAF' => [Socket],
                'PP_geQK2FMPwxmqVAAAH' => [Socket]
                },
                _fns: [],
                _ids: 0,
                server: Server {
                _events: [Object: null prototype] {},
                _eventsCount: 0,
                _maxListeners: undefined,
                _nsps: [Map],
                parentNsps: Map(0) {},
                parentNamespacesFromRegExp: Map(0) {},
                _path: '/socket.io',
                clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
                _connectTimeout: 45000,
                _serveClient: true,
                _parser: [Object],
                encoder: [Encoder],
                opts: [Object],
                _adapter: [class Adapter extends EventEmitter],
                sockets: [Circular *1],
                eio: [Server],
                httpServer: [Server],
                engine: [Server],
                [Symbol(kCapture)]: false
                },
                name: '/',
                adapter: [Circular *2],
                [Symbol(kCapture)]: false
            },
            rooms: Map(3) {
                'KhpqgPcvFej_fKvtAAAD' => Set(1) { 'KhpqgPcvFej_fKvtAAAD' },
                '4Q5T601u2cg7QhlnAAAF' => Set(1) { '4Q5T601u2cg7QhlnAAAF' },
                'PP_geQK2FMPwxmqVAAAH' => Set(1) { 'PP_geQK2FMPwxmqVAAAH' }
            },
            sids: Map(3) {
                'KhpqgPcvFej_fKvtAAAD' => Set(1) { 'KhpqgPcvFej_fKvtAAAD' },
                '4Q5T601u2cg7QhlnAAAF' => Set(1) { '4Q5T601u2cg7QhlnAAAF' },
                'PP_geQK2FMPwxmqVAAAH' => Set(1) { 'PP_geQK2FMPwxmqVAAAH' }
            },
            encoder: Encoder { replacer: undefined },
            [Symbol(kCapture)]: false
            }
         */
        console.log(`event: ${e}`)
    })
    socket.on("enter_room", (roomName, newRoom) => {
        socket.join(roomName)
        newRoom(roomName);
        socket.to(roomName).emit("welcome")
    })
})

httpServer.listen(3000, () => console.log(`listening on 3000`));
