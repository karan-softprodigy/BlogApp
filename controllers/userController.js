const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendEmailVerificationMail = async (userName, userEmail, userId) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_MAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_MAIL_ID,
    to: userEmail,
    subject: "Email Verification mail",
    html: `<p>Hi ${userName}, Please click the below link to verify your email. </p>
        <p><a href='http://localhost:4000/verifyEmail?id=${userId}'>Click here to verify your email<a/></p>`,
  };

  try {
    const result = await mailTransporter.sendMail(
      mailOptions,
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email Sent Successfully", info?.response);
        }
      }
    );
    if (result?.accepted?.length) {
      console.log("Mail sent successfully");
    }
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist?._id) {
    req.flash("error", "Email already exist !!");
    return res.redirect("/signup");
  }

  try {
    const newUser = await userModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    if (newUser?.username) {
      const { username, email, _id } = newUser;
      sendEmailVerificationMail(username, email, _id);

      req.flash(
        "registrationSuccess",
        "Registration Successful!! Please verify your email to sign in."
      );
      res.redirect("/signup");
    }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const verifyEmail = async (req, res) => {
  const { id } = req.query;
  try {
    const verifyUser = await userModel.updateOne(
      { _id: id },
      { $set: { isVerified: true } }
    );

    if (verifyUser?.acknowledged) {
      res.render("emailVerify");
    }
  } catch (error) {
    res.send(error);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  console.log(user, "user");

  if (!user) {
    req.flash("error", "Wrong credentials");
    return res.redirect("/signin");
  }

  const existingPassword = await bcrypt.compare(password, user.password);

  if (!existingPassword) {
    req.flash("error", "Wrong credentials");
    return res.redirect("/signin");
  }

  if (!user?.isVerified) {
    sendEmailVerificationMail(user.username, user.email, user._id);
    req.flash(
      "error",
      "Please verify your email id to login. We have sent an link to your email to verify you email Id."
    );
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
module.exports = { signup, verifyEmail, signin, logout };
