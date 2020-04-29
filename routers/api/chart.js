const express = require("express");
const passport = require("passport");
const Aritices = require("./../../model/Aritice");
const Tags = require("./../../model/Tag");
const Comment = require("../../model/Comment");
const Reply = require("../../model/Reply");
const mongoose = require("mongoose");

const router = express.Router();

// @route  POST api/chart/tag
// @desc   统计标签
// @access Private
router.get(
  "/tag",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tags.find().then((tags) => {
      let arr = {};
      arr.columns = ["tag", "count"];
      arr.rows = [];
      const p1 = new Promise((resolve) => {
        for (const key in tags) {
          const item = tags[key];
          Aritices.countDocuments({ tagId: item._id }).then((count) => {
            arr.rows.push({ tag: item.tag, count });
            if (key == tags.length - 1) {
              resolve();
            }
          });
        }
      });
      p1.then(() => {
        res.json(arr);
      });
    });
  }
);

// @route  POST api/chart/aritice
// @desc   统计文章创建时间
// @access Private
router.get(
  "/aritice",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Aritices.aggregate([
      {
        $project: {
          day: { $substr: [{ $add: ["$date", 28800000] }, 0, 10] }, //时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: 1 },
        },
      },
    ])
      .then((aritice) => {
        res.json(aritice);
      })
      .catch((err) => {
        res.status(404).json("数据获取失败");
      });
  }
);

module.exports = router;
