const express = require("express");
const blogRouter = express.Router();
const { authentication } = require("../middlewares/auth");
const {
  addBlog,
  getSingleBlog,
  addBlogPage,
  addComment,
  upload,
} = require("../controllers/blogController");

blogRouter.get("/addblog", authentication, addBlogPage);

blogRouter.post("/add-blog", upload.single("coverImage"), addBlog);

blogRouter.get("/blog/:blogId", getSingleBlog);

blogRouter.post("/blog/comment/:blogId", addComment);

module.exports = blogRouter;
