let express = require("express");
let authRouter = express.Router();
const {
  signupValidation,
  loginValidation,
} = require("../middlewares/authValidation");
const { signup, login, logout } = require("../controllers/authController");

authRouter.post("/login", loginValidation, login);
authRouter.post("/signup", signupValidation, signup);
authRouter.post("/logout", logout);

module.exports = authRouter;
