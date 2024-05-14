const mongoose = require("mongoose");

const commentModel = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.blogComments || mongoose.model("blogComments", commentModel);
