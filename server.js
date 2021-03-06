const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const db = require("./config/keys").mogoUrl;

const users = require("./routers/api/users");
const profiles = require("./routers/api/profiles");
const aritice = require("./routers/api/aritice");
const upload = require("./routers/api/upload");
const tag = require("./routers/api/tag");
const comment = require("./routers/api/comment");
const chart = require("./routers/api/chart");

const app = express();

/* 连接数据库 */
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("mongdb is connecting");
  })
  .catch((err) => {
    console.log(err);
  });

//使用中间件
//解析request中body的urlencoded字符，返回对象是一个键值对
//extended设置为false,键值对 值就为'String'或者'Array'
//为true，可以是任意类型
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" })); //最大上传大小不超过50mb
app.use(
  bodyParser.urlencoded({
    limit: "50mb",

    extended: true,
  })
);

//托管静态文件
app.use("/upload", express.static("upload"));

app.use(passport.initialize());
// 把passport 传给pasport.js
// 代码分离
require("./config/passport")(passport);

//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, Authorization"
  );
  next();
});

app.get("/test", (req, res) => {
  res.json(233);
});

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/aritice", aritice);
app.use("/api/upload", upload);
app.use("/api/tag", tag);
app.use("/api/comment", comment);
app.use("/api/chart", chart);

port = process.env.port || 2333; //没有配置端口号，就是用2333
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
