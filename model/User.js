const mongoose = require('mongoose')
const Schema = mongoose.Schema
let users = new Schema({
  name:{
    type:String,
    //必填项
    required:true
  },
  password:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  },
  avatar:{
    type:String
  },
  email:{
    type:String,
    required:true
  },
  identity:{
    type:String,
    required:true
  }
})

module.exports = users = mongoose.model('users',users)