const mongoose = require('mongoose') // 引入mongoose模块

// 定义数据模型，创建集合
const usersSchema = mongoose.Schema({
  roles: String,
  routerList: Array
}, {collection: 'userPermission'})

module.exports = mongoose.model('userPermission', usersSchema)
