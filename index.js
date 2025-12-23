const noteRouter = require("./App/routes/noteRoutes");
let express = require("express");
let app = express();
app.use(express.json());
require("dotenv").config();
let mongoose = require("mongoose");
let cors = require("cors");
app.use(cors({ origin: "*" }));

app.get("/health-check", (req, res) => {
  res.status(200).send({ message: "Server is running" });
});

app.use("/api/website/notes", noteRouter);


// connect to MongoDB
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
