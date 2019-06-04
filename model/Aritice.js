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
  }
})

module.exports = Aritices = mongoose.model('aritices',AriticeSchema)