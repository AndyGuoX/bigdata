// eslint-disable-next-line no-unused-vars
const Charts = require('../models/charts') // 用户表

/* charts接口路由 */

var express = require('express')
var router = express.Router()

/* 获取可视化图表的基本配置信息 */
router.get('/chartsBaseInfo', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let params = req.query
  Charts.findOne(
    {"chartsName": params.chartsName},
    ["chartsData"],
    function (err, charts) {
      if (err) console.log(err)
      if (!charts) {
        resJson.data.message = "表名不存在！"
        res.json(resJson)
      }
      resJson.data.chartsData = charts.chartsData
      res.json(resJson)
    })
})

module.exports = router
