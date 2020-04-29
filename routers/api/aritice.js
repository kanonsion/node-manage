const express = require("express");
const passport = require("passport");
const Aritices = require("./../../model/Aritice");
const Tags = require("./../../model/Tag");
const Comment = require("../../model/Comment");
const Reply = require("../../model/Reply");
const mongoose = require("mongoose");

const router = express.Router();

// @route  POST api/aritice/save
// @desc   存储文章信息
// @access Private
router.post(
  "/save",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const aritice = {};
    let tag = "";
    if (req.body.title) aritice.title = req.body.title;
    if (req.body.content) aritice.content = req.body.content;
    aritice.watch = 1;
    if (req.body.tag) tag = req.body.tag;
    Tags.find({ tag }).then((isexist) => {
      console.log(isexist);
      if (isexist.length === 0) {
        Tags({ tag })
          .save()
          .then((newTag) => {
            aritice.tagId = newTag._id;
            Aritices(aritice)
              .save()
              .then(() => {
                res.status(200).json({ msg: "新增成功" });
              })
              .catch(() => {
                res.status(404).json({ msg: "新增失败" });
              });
          });
      } else {
        aritice.tagId = isexist[0]._id;
        Aritices(aritice)
          .save()
          .then(() => {
            res.status(200).json({ msg: "新增成功" });
          })
          .catch(() => {
            res.status(404).json({ msg: "新增失败" });
          });
      }
    });
  }
);

// @route  GET api/aritice
// @desc   读取文章信息
// @access Private
router.post("/list", (req, res) => {
  let { page, pageSize } = req.body;
  Aritices.countDocuments().then((count) => {
    Aritices.find()
      .populate("tagId")
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then((aritices) => {
        if (!aritices) return res.json("数据读取失败");
        res.json({ aritices, total: count });
      })
      .catch((err) => res.json(err));
  });
});

// @route  GET api/aritice/edit/:id
// @desc   修改文章信息
// @access Private
router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const ariticesUpdate = {};
    if (req.body.title) ariticesUpdate.title = req.body.title;
    if (req.body.content) ariticesUpdate.content = req.body.content;
    if (req.body.watch) ariticesUpdate.watch = req.body.watch;
    Tags.findOne({ tag: req.body.tag })
      .then((tag) => {
        if (tag) {
          ariticesUpdate.tagId = tag._id;
          Aritices.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: ariticesUpdate }
          ).then((aritices) => {
            console.log(aritices);
            if (!aritices) return res.status(404).json({ msg: "修改失败" });
            res.status(200).json({ msg: "修改成功" });
          });
        }
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// @route  GET api/aritices/delete/:id
// @desc   删除文章信息
// @access Private
router.get(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Aritices.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        res.status(200).json({ msg: "删除成功" });
      })
      .catch(() => {
        res.status(404).json({ msg: "删除失败" });
      });
  }
);

/* 前台 */
// @route  GET api/aritice/:id
// @desc   读取文章信息
// @access Private
router.get("/:id", (req, res) => {
  Aritices.findOne({ _id: req.params.id })
    .populate("tagId")
    .lean()
    .then((aritices) => {
      if (!aritices) return res.status(404).json("数据读取失败");
      Aritices.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { watch: aritices.watch + 1 } }
      )
        .then(() => {
          Comment.aggregate([
            {
              $lookup: {
                from: "replies", // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
                localField: "_id", // 本地关联的字段
                foreignField: "commentId", // user中用的关联字段
                as: "children", // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
              },
            },
            {
              $match: { ariticeId: new mongoose.Types.ObjectId(req.params.id) },
            },
          ]).then((comment) => {
            let newObj = Object.assign({}, aritices);
            newObj.comment = [...comment];
            res.json(newObj);
          });
        })
        .catch(() => {
          res.status(404).json("数据读取失败");
        });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
