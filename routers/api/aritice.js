const express = require('express')
const passport = require('passport')
const Aritices = require('./../../model/Aritice')

const router = express.Router()

// @route  POST api/aritice/save
// @desc   存储文章信息
// @access Private
router.post('/save', passport.authenticate('jwt', { session: false }), (req, res) => {
  const aritice = {}
  console.log(req.body)
  if (req.body.title) aritice.title = req.body.title
  if (req.body.content) aritice.content = req.body.content
  new Aritices(aritice).save()
    .then(aritices => {
      res.json(aritices)
    })
})

// @route  GET api/aritice
// @desc   读取文章信息
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Aritices.find()
    .then(aritices => {
      if (!aritices) return res.json('数据读取失败')
      res.json(aritices)
    })
    .catch(err => res.json(err))
})

module.exports = router