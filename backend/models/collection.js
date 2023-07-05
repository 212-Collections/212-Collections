const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  view: {
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
  position: {
    type: Number,
  }
});

const Collection = mongoose.model(
  "Collection",
  collectionSchema,
  "collections"
);

module.exports = Collection;
