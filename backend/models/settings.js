const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  defaultTheme: {
    type: String,
  },
  defaultItemView: {
    type: String,
  },
  lang: {
    type: String,
  },
});

const Setting = mongoose.model("Setting", settingSchema, "settings");

module.exports = Setting;
