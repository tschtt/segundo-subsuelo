import { WebSocketServer } from "ws";
import chokidar from 'chokidar'

const wss = new WebSocketServer({ port: 3001 });
const wssCallbacks = [];

chokidar.watch("./output").on("all", (event) => {
    if (event === "change") {
        console.log('change')
        wssCallbacks.forEach((cb) => cb());
    }
});
  
wss.on("connection", (ws) => {
    wssCallbacks.push(onChange);
    ws.on("error", onError);
    ws.on("close", onClose);

    function onChange () {
        ws.send("refresh");
    }

    function onError (error) {
        console.log(error)
    }

    function onClose () {
        const index = wssCallbacks.findIndex(onChange);
        wssCallbacks.splice(index, 1);
    }
});
  