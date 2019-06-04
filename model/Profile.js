const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ProfileSchema = Schema({
  type: {
    type: String,
    require: true
  },
  describe: {
    type: String
  },
  income: {
    type: String,
    require: true
  },
  expend: {
    type: String,
    require: true
  },
  cash: {
    type: String,
    require: true
  },
  remake: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
})

module.exports = Profile = mongoose.model('profiles',ProfileSchema)