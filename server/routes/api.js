var express = require('express')
var router = express.Router()
// eslint-disable-next-line no-unused-vars
const Users = require('../models/users')

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
    resJson.data.loginResult = true
  } else {
    resJson.data.loginResult = false
    resJson.data.errorMessage = '用户名或密码不正确'
  }
  res.json(resJson)
})

module.exports = router

