require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log("We are listening...", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}.`);
});
