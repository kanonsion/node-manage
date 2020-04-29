const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let replySchema = Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  commentId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: "comment",
  },
  at: {
    type: String,
    require: true,
  },
});

module.exports = Reply = mongoose.model("reply", replySchema);
