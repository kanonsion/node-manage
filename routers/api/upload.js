const fs = require('fs')
const express = require('express')
const passport = require('passport')
const multer = require('multer')

const upload = multer({ dest: 'upload/' });

const router = express.Router()

// @route  POST api/upload
// @desc   上传文件
// @access Private
router.post('/', upload.array('files'), (req, res) => {
  for (var i = 0; i < req.files.length; i++) {
    // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
    // 对临时文件转存，fs.rename(oldPath, newPath,callback);
    fs.rename(req.files[i].path, "upload/" + req.files[i].originalname, function (err) {
      if (err) {
        throw err;
      }
      console.log('done!');
    })
    res.end(`http://localhost:3003/upload/${req.files[i].originalname}`)
  }
})


/* base64方案，431，废弃
router.post('/', function (req, res) {
  //接收前台POST过来的base64
  var imgData = req.body.imgData;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');
  fs.writeFile(`upload/${Date.now() + req.body.name}`, dataBuffer, err => {
    if (err) {
      res.send(err);
    } else {
      res.end('2333');
    }
  })
}); */

// @route  POST api/upload/delete
// @desc   删除文件
// @access Private
router.post('/delete', (req, res) => {
  fs.unlink(`upload/${req.body.name}`, function (error) {
    if (error) {
      res.send(false)
    }
    res.send(true)
  })
})


module.exports = router

