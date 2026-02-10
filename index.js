require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const listRouter = require("./App/routes/listRoutes");
const boardRouter = require("./App/routes/boardRoutes");
const inviteRouter = require("./App/routes/inviteRoutes");

const connectDB = require("./App/config/db");
const automationRouter = require("./App/routes/automationRoutes");
app.use(cors({ origin: "*" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});
app.io = io;
io.on("connection", (socket) => {
  socket.on("join-board", (boardId) => {
    socket.join(boardId.toString());
  });
});
app.use(express.json());
connectDB();

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/lists", listRouter);
app.use("/api/boards", boardRouter);
app.use("/api/invites", inviteRouter);
app.use("/api/automation", automationRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
