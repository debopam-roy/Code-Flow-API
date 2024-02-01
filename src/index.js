const cors = require("cors");
require("dotenv").config();
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnection = require("./db/database");
const app = express();
const server = http.createServer(app);

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

const privateRouter = require("./server")(server);

const dbConn = async () => {
  await dbConnection();
};

dbConn();

app
  .route("/")
  .get((req, res) => res.send("⚙️ Welcome to CodeFlow Homepage. ⚙️ "))
  .post((req, res) => res.send("⚙️ Welcome to CodeFlow Homepage. ⚙️ "));

app.use("/api", privateRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}.`);
});
