const express = require('express')
const passport = require('passport')
const Profile = require('./../../model/Profile')

const router = express.Router()

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json('success')
})

// $router POST api/profiles/add
// 添加信息
router.post('/add', passport.authenticate('jwt', { session: false })/* passport 验证 */, (req, res) => {
  const profile = {}
  if (req.body.type) profile.type = req.body.type
  if (req.body.describe) profile.describe = req.body.describe
  if (req.body.income) profile.income = req.body.income
  if (req.body.expend) profile.expend = req.body.expend
  if (req.body.cash) profile.cash = req.body.cash
  if (req.body.remake) profile.remake = req.body.remake
  if (req.body.date) profile.date = req.body.date
  new Profile(profile).save()
    .then(profile => {
      res.json(profile)
    })
})

// @route  GET api/profiles
// @desc   获取所有信息
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find()
    .then(profiles => {
      if (!profiles) return res.status(404).json('数据不存在')
      res.json(profiles)
    })
    .catch(err => { res.json(err) })
})

// @route  GET api/profiles/:id
// @desc   获取单个信息
// @access Private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => {
      if (!profile) return res.status(404).json('数据不存在')
      res.json(profile)
    })
    .catch(err => { res.json('查询错误') })
})

// @route  POST api/profiles/edit:id
// @desc   修改单个信息
// @access Private
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const ProfileUpdate = {}
  if(req.body.type) ProfileUpdate.type = req.body.type
  if(req.body.describe) ProfileUpdate.describe = req.body.describe
  if(req.body.income) ProfileUpdate.income = req.body.income
  if(req.body.expend) ProfileUpdate.expend = req.body.expend
  if(req.body.cash) ProfileUpdate.cash = req.body.cash
  if(req.body.remake) ProfileUpdate.remake = req.body.remake
  if(req.body.date) ProfileUpdate.date = req.body.date
  console.log(ProfileUpdate)
  Profile.findOneAndUpdate({ '_id': req.params.id }, { $set: ProfileUpdate },{new:true})
    .then(profile => {
      if (!profile) return res.status(404).json('数据不存在')
      res.json(profile)
    })
    .catch(err=>res.json('更新失败'))
})

// @route  POST api/profiles/delete:id
// @desc   删除单个信息
// @access Private
router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findByIdAndRemove({_id:req.params.id})
    .then(profile=>{
      res.json(profile)
    })
    .catch(err=>{res.json('删除失败')})
})

module.exports = router