require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const listRouter = require("./App/routes/listRoutes");
const boardRouter = require("./App/routes/boardRoutes");

require("./App/config/db");

// app.use(cors({ origin: "*" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-frontend-rouge.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/lists", listRouter);
app.use("/api/boards", boardRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
const serverless = require("serverless-http");
module.exports = serverless(app);
