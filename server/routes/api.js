var express = require('express')
var router = express.Router()
// eslint-disable-next-line no-unused-vars
const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const {secretKey} = require('../constant/constant')

/* api接口路由 */
router.post('/login', (req, res) => {
  let reqJson = req.body
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let reqUser = {
    userName: reqJson.userName,
    password: reqJson.password,
  }
  if (reqUser.userName === 'admin' && reqUser.password === "5f4dcc3b5aa765d61d8327deb882cf99") {
    const tokenObj = {
      username: reqUser.userName
    }
    let token = jwt.sign(tokenObj, secretKey, {
      expiresIn: 60 * 60 * 24 // 授权时效24小时
    })
    resJson.data.loginResult = true
    resJson.data.token = token
  } else {
    resJson.data.loginResult = false
    resJson.data.errorMessage = '用户名或密码不正确'
  }
  res.json(resJson)
})

/* 获取用户基本信息接口路由 */
router.get('/getUserInfo', (req, res) => {
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let token = req.headers.authorization.split(' ')[1];
  let decoded = jwt.decode(token, secretKey) // 解码token

  resJson.data.userName = decoded.username

  res.json(resJson)
})

module.exports = router

