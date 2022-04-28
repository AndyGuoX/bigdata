// 设置 Mongoose 连接
const mongoose = require('mongoose') // 引入mongoose
// 连接到bigdata数据库
// const username = 'root'
// const pwd = 'password'
const host = '127.0.0.1'
const post = '27017'
const database = 'bigdata'
// const mongoDB = `mongodb://${ username }:${ pwd }@${ host }:${ post }/${ database }` // 有密码
const mongoDB = `mongodb://${ host }:${ post }/${ database }` // 无密码
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  function (err) {
    if (err) {
      console.log('Connection Error:' + err)
    } else {
      console.log('Connection Success!')
    }
  }
)

module.exports = mongoose
