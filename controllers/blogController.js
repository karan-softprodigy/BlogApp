const { isUserLoggedIn } = require("../middlewares/auth");
const blogModel = require("../models/blog");

const addBlogPage = (req, res) => {
  const user = isUserLoggedIn(req, res);
  res.render("addBlog", {
    user: user,
    blogSuccess: req.flash("successBlog"),
    error: req.flash("errorBlog"),
  });
};

const addBlog = async (req, res) => {
  const { title, description } = req.body;
  try {
    await blogModel.create({
      title,
      description,
    });
    req.flash("successBlog", "Blog added Successfully");
    res.redirect("/addblog");
  } catch (err) {
    req.flash("errorBlog", "Something went wrong");
    res.redirect("/addblog");
  }
};

const getSingleBlog = async (req, res) => {
  const user = isUserLoggedIn(req, res);
  const { blogId } = req.params;
  const blog = await blogModel.findById(blogId);
  res.render("viewBlog", { user: user, blog: blog });
};

module.exports = { addBlog, getSingleBlog, addBlogPage };
