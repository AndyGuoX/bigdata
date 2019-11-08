/* user接口路由 */

var express = require('express')
var router = express.Router()
const mongoose = require('mongoose') // 引入mongoose模块
const Users = require('../models/users') // 用户表
const VisualPage = require('../models/visualPage') // 可视化页面表
const createToken = require('../token/createToken')
const decodeToken = require('../token/decodeToken')
const async = require('async')

/* 登录接口 */
router.post('/login', (req, res) => {
  let reqJson = req.body
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }

  Users.findOne(
    {'userName': reqJson.userName},
    ["name", "password", "_id", "roles"],
    function (err, docs) {
      if (err) console.log(err)
      if (!docs) {
        resJson.data.loginResult = false
        resJson.data.message = "用户名不存在！"
        res.json(resJson)
      } else {
        if (docs.password === reqJson.password) {
          const tokenObj = {
            "userid": docs._id,
            "name": docs.name,
            "roles": docs.roles,
          }
          let token = createToken(tokenObj) // 创建一个新的token
          resJson.data.loginResult = true
          resJson.data.token = token
        } else {
          resJson.data.loginResult = false
          resJson.data.message = "密码错误！"
        }
        res.json(resJson)
      }
    })
})

/* 获取用户基本信息 */
router.get('/getUserInfo', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let decoded = decodeToken(req) // 解码token，获得其中的身份信息
  resJson.data.name = decoded.name
  resJson.data.roles = decoded.roles
  res.json(resJson)
})

/* 登出 */
router.post('/logout', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  resJson.data.success = true
  res.json(resJson)
})

/* 获取用户的图表信息 */
router.get('/getVisualList', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let userId = mongoose.Types.ObjectId(decodeToken(req).userid)
  Users.findOne(
    {"_id": userId},
    ["visualPage"],
    function (err, docs) {
      if (err) console.log(err)
      if (!docs) {
        resJson.data.visualList = []
        res.json(resJson)
      } else {
        console.log(docs.visualPage)
        res.json(resJson)
      }
    })
})

/* 保存用户的可视化页面信息 */
router.post('/saveVisualPage', (req, res) => {
  let reqJson = req.body
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let userId = mongoose.Types.ObjectId(decodeToken(req).userid)
  let visualData = reqJson
  let visualPage = new VisualPage({
    visualPageId: visualData.visualPageId,
    visualPageData: {
      chartsList: visualData.chartsList,
      chartsGlobalSetting: visualData.chartsGlobalSetting
    }
  })
  async.parallel(
    {
      user: function (callback) {
        Users.updateOne(
          {"_id": userId},
          {
            $push: {
              "visualPage": {
                "visualPageId": visualData.visualPageId,
                "visualPageName": visualData.visualPageName
              }
            }
          },
          function (err, docs) {
            callback(err, docs)
          }
        )
      },
      visualPage: function (callback) {
        visualPage.save(function (err, docs) {
          callback(err, docs)
        })
      }
    },
    function (e, r) {
      if (e) console.log(e)
      console.log(r)
      resJson.data.saveSuccess = true
      res.json(resJson)
    }
  )
})

module.exports = router

