// 设置 Mongoose 连接
const mongoose = require('mongoose') // 引入mongoose
//连接到bigdata数据库
const mongoDB = 'mongodb://localhost:27017/bigdata'
mongoose.connect(mongoDB, {useNewUrlParser: true}, function (err) {
  if (err) {
    console.log('Connection Error:' + err)
  } else {
    console.log('Connection Success!')
  }
})

module.exports = mongoose
