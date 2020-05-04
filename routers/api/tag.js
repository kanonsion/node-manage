const Tags = require("./../../model/Tag");
const Aritice = require("./../../model/Aritice");
const express = require("express");
const passport = require("passport");

const router = express.Router();

// @route  GET api/tag/list
// @desc   读取文章信息
// @access Private
router.post(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { page, pageSize } = req.body;
    Tags.count().then((count) => {
      Tags.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then((tags) => {
          if (!tags) return res.json("数据读取失败");
          console.log(tags);
          res.json({ tags, total: count });
        })
        .catch((err) => res.json(err));
    });
  }
);

// @route  GET api/tag/delete/:id
// @desc   删除文章信息
// @access Private
router.get(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tags.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        Aritice.remove({ tagId: req.params.id })
          .then(() => {
            res.status(200).json({ msg: "删除成功" });
          })
          .catch(() => {
            res.status(404).json({ msg: "删除失败" });
          });
      })
      .catch(() => {
        res.status(404).json({ msg: "删除失败" });
      });
  }
);

// @route  GET api/tag/edit/:id
// @desc   删除文章信息
// @access Private
router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newTag = {};
    let { tag, tagColor } = req.body;
    newTag.tag = tag;
    newTag.tagColor = tagColor;
    Tags.findByIdAndUpdate({ _id: req.params.id }, { $set: newTag })
      .then((tag) => {
        if (tag) {
          res.status(200).json({ msg: "修改成功" });
        } else {
          res.status(404).json({ msg: "修改失败" });
        }
      })
      .catch(() => {
        res.status(404).json({ msg: "修改失败" });
      });
  }
);

// @route  GET api/tag/delete/:id
// @desc   删除文章信息
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { tag, tagColor } = req.body;
    const newTag = {};
    newTag.tag = tag;
    newTag.tagColor = tagColor;
    Tags(newTag)
      .save()
      .then((tag) => {
        if (tag) {
          res.status(200).json({ msg: "新增成功" });
        } else {
          res.status(404).json({ msg: "新增失败" });
        }
      })
      .catch(() => {
        res.status(404).json({ msg: "新增失败" });
      });
  }
);
/* 前台 */

// @route  GET api/tag
// @desc   读取所有文章信息
// @access Private
router.get("/", (req, res) => {
  Tags.find()
    .lean()
    .then((tags) => {
      if (!tags) return res.json("数据读取失败");
      res.json(tags);
      /* let list = [];
      let arr = [];
      tags.forEach((item) => {
        list.push(
          new Promise((resolve) => {
            Aritice.find({ tagId: item._id }).then((ariRes) => {
              let obj = {};
              obj.children = ariRes;
              arr.push(Object.assign(obj, item));
              resolve();
            });
          })
        );
      });
      Promise.all(list).then(() => {
        res.json(arr);
      }); */
    })
    .catch((err) => res.json(err));
});

// @route  GET api/tag
// @desc   单个标签信息
// @access Private
router.post("/classify/:tag", (req, res) => {
  let { page, pageSize } = req.body;
  let skip = (page - 1) * pageSize;
  Tags.find({ tag: req.params.tag })
    .then((tag) => {
      let tagId = tag[0]._id;
      Aritice.countDocuments({ tagId: tagId }).then((count) => {
        Aritice.find({ tagId: tagId })
          .lean()
          .skip(skip)
          .limit(pageSize)
          .sort({ date: -1 })
          .then((aritice) => {
            let newAritice = {};
            newAritice.aritices = aritice;
            newAritice.total = count;
            newAritice.tag = tag.tag;
            res.json(newAritice);
          });
      });
    })
    .catch(() => {
      res.status(404).json({ msg: "数据读取失败" });
    });
});
module.exports = router;
