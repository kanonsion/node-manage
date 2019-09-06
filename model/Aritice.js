const mongoose = require('mongoose')
const Schema = mongoose.Schema

let AriticeSchema = Schema({
  title:{
    type:String,
    require:true
  },
  date:{
    type:Date,
    default:Date.now
  },
  content:{
    type:String,
    require:true
  },
  tagId:{
    type:mongoose.Schema.ObjectId,
    require:true,
    ref:'tags'
  },
  watch:{
    type:Number,
    default:1
  }
})

module.exports = Aritices = mongoose.model('aritices',AriticeSchema)