const { isUserLoggedIn } = require("../middlewares/auth");
const blogModel = require("../models/blog");
const blogCommentModel = require("../models/blogComment");
const blogUsers = require("../models/users");
const multer = require("multer");
const path = require("path");

const addBlogPage = (req, res) => {
  const user = isUserLoggedIn(req, res);
  res.render("addBlog", {
    user: user,
    blogSuccess: req.flash("successBlog"),
    error: req.flash("errorBlog"),
  });
};

const addBlog = async (req, res, next) => {
  const { title, description, coverImage } = req.body;
  const user = isUserLoggedIn(req, res);

  console.log(req.file);
  try {
    await blogModel.create({
      title,
      description,
      createdBy: user.id,
      bannerImage: `/uploads/${req.file.filename}`,
    });
    req.flash("successBlog", "Blog added Successfully");
    res.redirect("/addblog");
  } catch (err) {
    req.flash("errorBlog", "Something went wrong");
    res.redirect("/addblog");
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const getSingleBlog = async (req, res) => {
  const user = isUserLoggedIn(req, res);
  const { blogId } = req.params;
  const blog = await blogModel.findById(blogId).populate("createdBy");
  const comments = await blogCommentModel
    .find({ blogId })
    .populate("createdBy");
  res.render("viewBlog", {
    user,
    blog,
    comments,
  });
};

const addComment = async (req, res, next) => {
  const { comment } = req.body;
  const { blogId } = req.params;
  const user = isUserLoggedIn(req, res);

  await blogCommentModel.create({
    comment,
    blogId,
    createdBy: user.id,
  });
  return res.redirect(`/blog/${blogId}`);
};

module.exports = { addBlog, getSingleBlog, addBlogPage, addComment, upload };
