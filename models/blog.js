const mongoose = require("mongoose");

const blogModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: false,
      default: "images/bannerImg.jpeg",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogusers",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.blogs || mongoose.model("blogs", blogModel);
