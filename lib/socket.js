import { Server } from "socket.io";
import express from 'express'
import http from 'http'
import { log } from "console";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
    connectionStateRecovery: {}
})


const onlineUsers = {};

/*setTimeout(() => {
    console.log(io.engine.clientsCount);
}, 10000)*/
io.on('connection', (socket,) => {
    console.log(socket.id);



})


export { io, app, server };




