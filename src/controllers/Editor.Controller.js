const asyncHandler = require("../utils/AsyncHandler");
const socketIO = require("socket.io");
const ACTION = require("../utils/Actions");

const io = socketIO(server, {
  transports: ['websocket'],
});

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

const editorInitialize = asyncHandler(async (req, res) => {
  io.on("connection", (socket) => {
    socket.on(ACTION.JOIN, ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTION.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      const username = userSocketMap[socket.id];
      delete userSocketMap[socket.id];

      // Notify other clients about the disconnection
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTION.DISCONNECTED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });
  });

  res.send("Editor initialized");
});

module.exports = editorInitialize;
