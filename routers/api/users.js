const express = require("express");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const users = require("../../model/User");
const ruleName = require("./../../config/keys").secretOrkeys;
const router = express.Router();

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }) /* passport 验证 */,
  (req, res) => {
    res.json("2333");
  }
);

// $router POST api/users/register
router.post("/register", (req, res) => {
  users.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      return res.status(200).json("用户名已被使用");
    } else {
      const avatar = gravatar.url("2273091645@qq.com", {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newuser = new users({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        avatar,
        identity: req.body.identity,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newuser.password, salt, (err, hash) => {
          if (err) throw err;
          newuser.password = hash;
          newuser.save().then((user) => {
            res.json(user);
          });
        });
      });
    }
  });
});

// $router POST api/users/login
// @desc   返回token jwt password
router.post("/login", (req, res) => {
  //查询数据库
  users.findOne({ name: req.body.name }).then((user) => {
    if (!user) {
      return res.status(200).json({ msg: "用户不存在", status: false });
    } else {
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          //获取token
          const rule = {
            name: user.name,
            id: user.id,
            identity: user.identity,
            avatar: user.avatar,
          };
          jwt.sign(rule, ruleName, { expiresIn: "1h" }, (err, token) => {
            if (err) throw err;
            res.json({
              msg: "登录成功",
              token: "bearer " + token,
              status: true,
            });
          });
        } else {
          res.status(200).json({ msg: "密码输入错误", status: false });
        }
      });
    }
  });
});

// $router GET api/users
// @desc   return user
router.post(
  "/",
  passport.authenticate("jwt", { session: false }) /* passport 验证 */,
  (req, res) => {
    let { page, pageSize } = req.body;
    users.count().then((count) => {
      users
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then((user) => {
          if (!user) return res.status(404).json("数据获取失败");
          bcrypt.compare(user.passport);
          res.json({ user, total: count });
        })
        .catch(() => {
          res.status(404).json("数据获取失败");
        });
    });
  }
);

// @route  GET api/users/:id
// @desc   获取单个信息
// @access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }) /* passport 验证 */,
  (req, res) => {
    users
      .findOne({ _id: req.params.id })
      .then((user) => {
        if (!user) return res.status(404).json("数据获取失败");
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// @route  POST api/users/edit:id
// @desc   修改单个信息
// @access Private
router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }) /* passport 验证 */,
  (req, res) => {
    const userUpdate = {};
    if (req.body.name) userUpdate.name = req.body.name;
    if (req.body.email) userUpdate.email = req.body.email;
    if (req.body.identity) userUpdate.identity = req.body.identity;
    console.log(req.body.name);
    users
      .findOneAndUpdate({ _id: req.params.id }, { $set: userUpdate })
      .then((user) => {
        if (!user) return res.status(404).json("数据获取失败");
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// @route  POST api/users/delete:id
// @desc   删除单个信息
// @access Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndRemove({ _id: req.params.id })
      .then((surplusUsers) => {
        surplusUsers.save().then((surplusUsers) => {
          res.json(surplusUsers);
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// $router POST api/users/current
// @desc   return user
// 通过token得到用户信息
// 使用passport-jwt 验证token
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }) /* passport 验证 */,
  (req, res) => {
    res.json({
      name: req.user.name,
      id: req.user.id,
      email: req.user.email,
      identity: req.user.identity,
    });
  }
);
module.exports = router;
