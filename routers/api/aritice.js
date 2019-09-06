const express = require('express')
const passport = require('passport')
const Aritices = require('./../../model/Aritice')
const Tags = require('./../../model/Tag')

const router = express.Router()

// @route  POST api/aritice/save
// @desc   存储文章信息
// @access Private
router.post('/save', passport.authenticate('jwt', { session: false }), (req, res) => {
  const aritice = {}
  const tag = {}
  if (req.body.title) aritice.title = req.body.title
  if (req.body.content) aritice.content = req.body.content
  if (req.body.tag) tag.tag = req.body.tag
  Tags.findOne(tag)
    .then(res => {
      if (!res) {
        new Tags(tag).save().then((resTag) => {
          aritice.tagId = resTag._id
          new Aritices(aritice).save()
        })
      } else {
        aritice.tagId = res._id
        new Aritices(aritice).save()
      }
    })
})



// @route  GET api/aritice
// @desc   读取文章信息
// @access Private
router.get('/', (req, res) => {
  Aritices.find().populate('tagId').sort({date:-1})
    .then(aritices => {
      if (!aritices) return res.json('数据读取失败')
      res.json(aritices)
    })
    .catch(err => res.json(err))
})

// @route  GET api/aritice/:id
// @desc   读取文章信息
// @access Private
router.get('/:id', (req, res) => {
  Aritices.updateOne({ _id: req.params.id }, { $set: { watch: 233333 } })
  Aritices.findOne({ _id: req.params.id }).populate('tagId')
    .then(aritices => {
      if (!aritices) return res.json('数据读取失败')
      res.json(aritices)
    })
    .catch(err => res.json(err))
})

// @route  GET api/aritice/Classification/:tagId
// @desc   读取文章信息
// @access Private
router.get('/Classification/:tagId', (req, res) => {
  Aritices.find({ tagId: req.params.tagId })
    .then(aritices => {
      if (!aritices) return res.json('数据读取失败')
      res.json(aritices)
    })
    .catch(err => res.json(err))
})

module.exports = router