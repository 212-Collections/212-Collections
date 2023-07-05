const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  theme: {
    type: String,
  },
  itemview: {
    type: String,
  },
});

const Setting = mongoose.model("Setting", settingSchema, "settings");

module.exports = Setting;
