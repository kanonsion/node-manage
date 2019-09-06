const Aritices = require('./../../model/Aritice')
const express = require('express')

const router = express.Router()

// @route  GET api/aritices
// @desc   读取所有文章信息
// @access Private
router.get('/', (req, res) => {
  Aritices.find()
    .then(aritices => {
      if (!aritices) return res.json('数据读取失败')
      res.json(aritices)
    })
    .catch(err => res.json(err))
})

// @route  GET api/aritices/edit/:id
// @desc   修改文章信息
// @access Private
router.post('/edit/:id', (req, res) => {
  const ariticesUpdate = {}
  if (req.body.title) ariticesUpdate.title = req.body.title
  if (req.body.content) ariticesUpdate.content = req.body.content
  if (req.body.watch) ariticesUpdate.watch = req.body.watch
  Aritices.findByIdAndUpdate({ _id: req.params.id }, { $set: ariticesUpdate })
    .then(aritices => {
      if (!aritices) return res.status(404).json('数据获取失败')
      res.json(aritices)
    })
    .catch(err => { res.json(err) })
})

// @route  GET api/aritices/delete/:id
// @desc   删除文章信息
// @access Private
router.get('/delete/:id', (req, res) => {
  Aritices.findOneAndRemove({ _id: req.params.id })
    .then(aritices => {
      aritices.save().then(newAritices => res.json(newAritices))
    })
    .catch(err => { res.json(err) })
})

module.exports = router