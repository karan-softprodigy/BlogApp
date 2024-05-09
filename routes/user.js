const express = require("express");
const userRouter = express.Router();
const { signup, signin } = require("../controllers/userController");

userRouter.get("/signin", (req, res) => {
  res.render("signin", { error: req.flash("error") });
});

userRouter.get("/signup", (req, res) => {
  res.render("signup");
});

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

module.exports = userRouter;
