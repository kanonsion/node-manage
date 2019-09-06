const Tags = require('./../../model/Tag')
const Aritice = require('./../../model/Aritice')
const express = require('express')

const router = express.Router()

// @route  GET api/tag
// @desc   读取文章信息
// @access Private
router.get('/', (req, res) => {
  Tags.find()
    .then(tags => {
      if (!tags) return res.json('数据读取失败')
      res.json(tags)
    })
    .catch(err => res.json(err))
})

router.post('/:id', (req, res) => {
  Aritice.find()
})

module.exports = router