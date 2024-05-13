const express = require("express");
const userRouter = express.Router();
const { signup, signin, logout } = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const { isUserLoggedIn } = require("../middlewares/auth");

userRouter.get("/signin", (req, res) => {
  const userData = isUserLoggedIn(req, res);
  if (Object.keys(userData).length) {
    return res.redirect("/");
  } else {
    res.render("signin", { error: req.flash("error") });
  }
});

userRouter.get("/signup", (req, res) => {
  const userData = isUserLoggedIn(req, res);
  if (Object.keys(userData).length) {
    return res.redirect("/");
  } else {
    res.render("signup");
  }
});

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/logout", logout);

module.exports = userRouter;
