const express = require("express");
const userRouter = express.Router();
const {
  signup,
  signin,
  logout,
  verifyEmail,
} = require("../controllers/userController");
const { isUserLoggedIn } = require("../middlewares/auth");

userRouter.get("/signin", (req, res) => {
  const userData = isUserLoggedIn(req, res);
  if (Object.keys(userData).length) {
    return res.redirect("/");
  } else {
    res.render("signin", { user: userData, error: req.flash("error") });
  }
});

userRouter.get("/signup", (req, res) => {
  const userData = isUserLoggedIn(req, res);
  if (Object.keys(userData).length) {
    return res.redirect("/");
  } else {
    res.render("signup", {
      user: userData,
      registrationSuccess: req.flash("registrationSuccess"),
      error: req.flash("error"),
    });
  }
});

userRouter.post("/signup", signup);
userRouter.get("/verifyEmail", verifyEmail);
userRouter.post("/signin", signin);
userRouter.get("/logout", logout);

module.exports = userRouter;
