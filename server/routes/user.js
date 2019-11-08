/* user接口路由 */

var express = require('express')
var router = express.Router()
const Users = require('../models/users') // 用户表
const createToken = require('../token/createToken')
const decodeToken = require('../token/decodeToken')

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
    function (err, user) {
      if (err) console.log(err)
      if (!user) {
        resJson.data.loginResult = false
        resJson.data.message = "用户名不存在！"
        res.json(resJson)
      } else {
        if (user.password === reqJson.password) {
          const tokenObj = {
            "userid": user._id,
            "name": user.name,
            "roles": user.roles,
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
  let userId = decodeToken(req).userid
  Users.findOne(
    {"userId": userId},
    ["visualPage"],
    function (err, visualPage) {
      if (err) console.log(err)
      if (!visualPage) {
        resJson.data.visualList = []
        res.json(resJson)
      } else {
        console.log(visualPage.visualPage)
        res.json(resJson)
      }
    })
})

module.exports = router

