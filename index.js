require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const listRouter = require("./App/routes/listRoutes");

require("./App/config/db");

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/website/notes", noteRouter);
app.use("/api/website/auth", authRouter);
app.use("/api/website/lists", listRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
