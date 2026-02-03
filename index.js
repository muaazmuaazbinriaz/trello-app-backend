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

require("./App/config/db");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/lists", listRouter);
app.use("/api/boards", boardRouter);
app.use("/api/invites", inviteRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
