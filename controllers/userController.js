const bcrypt = require("bcrypt");
const userModel = require("../models/users");

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

  res.redirect("/");
};
module.exports = { signup, signin };
