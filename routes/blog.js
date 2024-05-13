const express = require("express");
const blogRouter = express.Router();
const { authentication } = require("../middlewares/auth");
const {
  addBlog,
  getSingleBlog,
  addBlogPage,
} = require("../controllers/blogController");

blogRouter.get("/addblog", authentication, addBlogPage);

blogRouter.post("/add-blog", addBlog);

blogRouter.get("/blog/:blogId", getSingleBlog);

module.exports = blogRouter;
