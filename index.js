require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const noteRouter = require("./App/routes/noteRoutes");
const userRouter = require("./App/routes/userRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Fix CORS: allow your frontend origin
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-frontend-yourdomain.vercel.app",
    ], // add your frontend domains
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/health-check", (req, res) => {
  res.status(200).send({ message: "Server is running" });
});

// Routes
app.use("/api/website/notes", noteRouter);
app.use("/api/website/users", userRouter);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
