const mongoose = require('mongoose')
const Schema = mongoose.Schema

let tagSchema = new Schema({
  tag:{
    required:'true',
    type:String,
    default:'vue'
  },
  date:{
    type:Date,
    default:Date.now
  }
})

module.exports = tags = mongoose.model('tags',tagSchema)