const mongoose = require('mongoose') // 引入mongoose模块

// 定义数据模型，创建集合
const visualPageSchema = mongoose.Schema({
  visualPageId: String,
  visualPageData: Object
}, {collection: 'visualPage'})

module.exports = mongoose.model('visualPage', visualPageSchema)
