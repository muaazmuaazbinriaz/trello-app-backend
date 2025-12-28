require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const noteRouter = require("./App/routes/noteRoutes");
const authRouter = require("./App/routes/authRoutes");
const productRouter = require("./App/routes/productRouter");

const PORT = process.env.PORT || 3000;

require("./App/models/db");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use("/api/website/notes", noteRouter);
app.use("/api/website/auth", authRouter);
app.use("/api/website/products", productRouter);

app.get("/health-check", (req, res) => {
  res.status(200).send({ message: "Server is running" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is alive" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
