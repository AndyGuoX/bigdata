const mongoose = require('mongoose') // 引入mongoose模块

// 定义数据模型，创建集合
const chartsSchema = mongoose.Schema({
  chartsName: String,
  chartsData: Object
}, {collection: 'chartsBaseInfo'})

module.exports = mongoose.model('chartsBaseInfo', chartsSchema)
