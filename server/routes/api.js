/* api接口路由 */

var express = require('express')
var router = express.Router()
const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const {secretKey} = require('../constant/constant')

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
    function (err, user) {
      console.log(user)
      if (err) console.log(err)
      if (!user) {
        resJson.data.loginResult = false
        resJson.message = "用户名不存在！"
        res.json(resJson)
      } else {
        // user.comparePassword(reqJson.password, function (err, isMatch) {
        //   if (err) {
        //     console.log(err)
        //   }
        //   if (isMatch) {
        //     const tokenObj = {
        //       username: reqJson.userName
        //     }
        //     let token = jwt.sign(tokenObj, secretKey, {
        //       expiresIn: 60 * 60 * 24 // 授权时效24小时
        //     })
        //     resJson.data.loginResult = true
        //     resJson.data.token = token
        //   } else {
        //     resJson.data.loginResult = false
        //     resJson.message = "密码错误！"
        //   }
        // })
      }
    })
})

/* 获取用户基本信息接口路由 */
router.get('/getUserInfo', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let token = req.headers.authorization.split(' ')[1]
  let decoded = jwt.decode(token, secretKey) // 解码token

  resJson.data.userName = decoded.username

  res.json(resJson)
})

module.exports = router

