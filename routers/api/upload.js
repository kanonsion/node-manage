const fs = require('fs')
const express = require('express')
const passport = require('passport')
const multer = require('multer')

const upload = multer({ dest: 'upload/' })
const router = express.Router()

// @route  POST api/upload
// @desc   上传文件
// @access Private
router.post('/', upload.array('imageFile'), (req, res) => {
  for (var i = 0; i < req.files.length; i++) {
    // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
    // 对临时文件转存，fs.rename(oldPath, newPath,callback);
    fs.rename(req.files[i].path, "upload/" + req.files[i].originalname, function (err) {
      if (err) {
        throw err;
      }
      console.log('done!');
    })
    res.end(JSON.stringify(req.files) + JSON.stringify(req.body))
  }
})

module.exports = router

