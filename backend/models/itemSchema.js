const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
  color1: {
    type: String,
  },
  color2: {
    type: String,
  },
  icon: {
    border: {
      type: String,
    },
    data: {
      type: String,
    },
    render: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  image: {
    data: {
      type: String,
    },
    render: {
      type: String,
    },
    type: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  link: {
    type: String,
  },
  tags: {
    type: [String],
  },
  version: {
    type: String,
  },
});

module.exports = itemSchema;
