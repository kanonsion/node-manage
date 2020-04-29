const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Comment = require("../../model/Comment");
const Reply = require("../../model/Reply");
const Aritices = require("./../../model/Aritice");
const Tags = require("./../../model/Tag");

const router = express.Router();

// @route  POST api/comment/aritice
// @desc   文章标题
// @access Private
router.get("/aritice", (req, res) => {
  Tags.aggregate([
    {
      $lookup: {
        from: "aritices", // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
        localField: "_id", // 本地关联的字段
        foreignField: "tagId", // user中用的关联字段
        as: "children", // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
      },
    },
  ])
    .then((aritice) => {
      res.json(aritice);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// @route  POST api/comment/list
// @desc   评论列表
// @access Private
router.post("/list", (req, res) => {
  let { page, pageSize, id } = req.body;
  if (id) {
    Comment.aggregate([
      {
        $lookup: {
          from: "replies", // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
          localField: "_id", // 本地关联的字段
          foreignField: "commentId", // user中用的关联字段
          as: "children", // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
        },
      },
      { $match: { ariticeId: new mongoose.Types.ObjectId(id) } },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $group: {
          _id: null,
          list: { $push: "$$ROOT" },
          total: { $sum: 1 },
        },
      },
    ])
      .then((comment) => {
        res.json(...comment);
      })
      .catch((err) => {
        res.status(404).json("数据获取失败");
      });
  } else {
    Comment.aggregate([
      {
        $lookup: {
          from: "replies", // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
          localField: "_id", // 本地关联的字段
          foreignField: "commentId", // user中用的关联字段
          as: "children", // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
        },
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $group: {
          _id: null,
          list: { $push: "$$ROOT" },
          total: { $sum: 1 },
        },
      },
    ])
      .then((comment) => {
        res.json(...comment);
      })
      .catch((err) => {
        res.status(404).json("数据获取失败");
      });
  }
});

// @route  POST api/comment/del
// @desc   删除
// @access Private
router.post("/del/:id", (req, res) => {
  let { id } = req.params;
  let { isReply } = req.body;
  if (isReply) {
    Reply.deleteOne({ _id: id })
      .then(() => {
        res.json({ msg: "删除成功" });
      })
      .catch(() => {
        res.status(404).json("删除失败");
      });
  } else {
    Comment.deleteOne({ _id: id })
      .then(() => {
        Reply.deleteMany({ commentId: id }).then(() => {
          res.json({ msg: "删除成功" });
        });
      })
      .catch(() => {
        res.status(404).json("删除失败");
      });
  }
});

/* 前台 */
// @route  POST api/comment/save
// @desc   添加评论
// @access Private
router.post("/save", (req, res) => {
  const comment = {};
  let { id, name, context, isReply, at } = req.body;
  comment.name = name;
  comment.comment = context;
  if (isReply) {
    comment.commentId = id;
    comment.at = at;
    Reply(comment)
      .save()
      .then(() => {
        res.status(200).json({ msg: "新增成功" });
      })
      .catch(() => {
        res.status(404).json({ msg: "新增失败" });
      });
  } else {
    comment.ariticeId = id;
    Comment(comment)
      .save()
      .then(() => {
        res.status(200).json({ msg: "新增成功" });
      })
      .catch(() => {
        res.status(404).json({ msg: "新增失败" });
      });
  }
});

module.exports = router;
