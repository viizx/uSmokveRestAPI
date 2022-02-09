const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    body: {
      type: String,
      required: true,
      min: 5,
      max: 255,
    },
    quantity: {
      type: String,
      required: true,
      min: 1,
      max: 1024,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
