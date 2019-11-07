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
    ["password"],
    function (err, user) {
      if (err) console.log(err)
      if (!user) {
        resJson.data.loginResult = false
        resJson.data.message = "用户名不存在！"
        res.json(resJson)
      } else {
        if (user.password === reqJson.password) {
          const tokenObj = {
            username: reqJson.userName,
            roles: user.roles,
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

  Users.findOne(
    {'userName': decoded.username},
    ["name", "roles"],
    function (err, user) {
      if (err) console.log(err)
      resJson.data.name = user.name
      resJson.data.roles = user.roles
      res.json(resJson)
    })
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
router.get('/logout', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  resJson.data.success = true
  res.json(resJson)
})

module.exports = router

