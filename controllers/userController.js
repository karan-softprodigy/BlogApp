const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await userModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    res.redirect("/signin");
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    req.flash("error", "Wrong credentials");
    return res.redirect("/signin");
  }
  const existingPassword = await bcrypt.compare(password, user.password);

  if (!existingPassword) {
    req.flash("error", "Wrong credentials");
    return res.redirect("/signin");
  }

  const jwtPayload = {
    email: user.email,
    username: user.username,
    role: user.role,
    profileImage: user.profileImageURL,
    id: user._id,
  };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY);
  res.locals.user = jwtPayload;
  res.cookie("token", token).redirect("back");
};

const logout = (req, res, next) => {
  res.clearCookie("token");
  res.redirect("back");
};
module.exports = { signup, signin, logout };
