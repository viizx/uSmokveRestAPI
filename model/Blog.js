const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 5,
      max: 255,
    },
    body: {
      type: String,
      required: true,
      min: 5,
      max: 9999,
    },
    author: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
