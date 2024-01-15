const cookieParser = require("cookie-parser");
const dbConnection = require("./db/database");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const privateRouter = require("./server");

const dbConn = async () => {
  await dbConnection();
};

dbConn();
app
  .route("/")
  .get(() => "⚙️ Welcome to CodeFlow Homepage. ⚙️ ")
  .post(() => "⚙️ Welcome to CodeFlow Homepage. ⚙️ ");
app.use("/api", privateRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}.`);
});

// const http = require("http")
// const { Server } = require("socket.io")
// const ACTION = require("./utils/Actions")
// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// })

// const userSocketMap = {}
// const getAllConnectedClients = (roomId) => {
//   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//     (socketId) => {
//       return {
//         socketId,
//         username: userSocketMap[socketId],
//       }
//     }
//   )
// }

// io.on("connection", (socket) => {
//   socket.on(ACTION.JOIN, ({ roomId, username }) => {
//     userSocketMap[socket.id] = username
//     socket.join(roomId)
//     const clients = getAllConnectedClients(roomId)
//     clients.forEach(({ socketId }) => {
//       io.to(socketId).emit(ACTION.JOINED, {
//         clients,
//         username,
//         socketId: socket.id,
//       })
//     })
//   })
// })
