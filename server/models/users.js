const mongoose = require('mongoose') // 引入mongoose模块

// const visualPageChildSchema = mongoose.Schema({
//   visualPageId: String,
//   visualPageName: String,
//   visualPageImg: String
// })

// 定义数据模型，创建集合
const usersSchema = mongoose.Schema({
  name: String, // name 的形式为String
  age: Number, // age 的形式为int
  addr: String, // addr 的形式为String
  userName: String,
  password: String,
  roles: Array,
  // visualPage: [visualPageChildSchema]
  visualPage: Array
}, {collection: 'users'})

module.exports = mongoose.model('users', usersSchema)
