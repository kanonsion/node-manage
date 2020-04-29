const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tagSchema = new Schema({
  tag: {
    required: true,
    type: String,
  },
  tagColor: {
    required: true,
    type: String,
    default: "rgba(0,0,0,1)",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = tags = mongoose.model("tags", tagSchema);
