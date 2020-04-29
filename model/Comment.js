const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name:{
    type: String,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  ariticeId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: "aritices",
  },
});

module.exports = Comment = mongoose.model("comment", commentSchema);
