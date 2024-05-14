const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const { isUserLoggedIn } = require("./middlewares/auth");
const blogModel = require("./models/blog");

// connecting to DB and then starting the server
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB Connected and Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false })); //use this when form is made using ejs (when form us made in server side)
app.use(bodyParser.json()); // use this when form data is coming from client side
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "expressJSNode", //any random key
  })
);
app.use(flash());
app.use("/", userRouter);
app.use("/", blogRouter);

app.get("/", async (req, res) => {
  const user = isUserLoggedIn(req, res);
  const allBlogs = await blogModel.find();
  res.render("home", { user: user, blogs: allBlogs });
});
