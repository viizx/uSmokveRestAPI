const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
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
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
