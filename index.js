require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const listRouter = require("./App/routes/listRoutes");
const boardRouter = require("./App/routes/boardRoutes");
const inviteRouter = require("./App/routes/inviteRoutes");

const connectDB = require("./App/config/db");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error in middleware:", error);
    return res.status(503).json({
      success: false,
      message: "Database connection failed, please try again",
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/lists", listRouter);
app.use("/api/boards", boardRouter);
app.use("/api/invites", inviteRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

const PORT = process.env.PORT || 3000;
module.exports = app;
