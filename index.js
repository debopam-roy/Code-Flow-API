require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const ACTION = require('./Actions');
app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: '*',
  }
});

const userSocketMap= {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId)|| []).map(
    (socketId) =>{
      return {
        socketId,
        username: userSocketMap[socketId],
      }
    });
};

io.on("connection", (socket) => {

  socket.on(ACTION.JOIN,({roomId, username})=> {
    userSocketMap[socket.id]=username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({socketId}) => {
      io.to(socketId).emit(ACTION.JOINED,{
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
});



const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}.`);
});
