/* user接口路由 */

var express = require('express')
var router = express.Router()
const mongoose = require('mongoose') // 引入mongoose模块
const Users = require('../models/users') // 用户表
const VisualPage = require('../models/visualPage') // 可视化页面表
const createToken = require('../token/createToken')
const decodeToken = require('../token/decodeToken')
const async = require('async')
const fs = require('fs') // 文件操作
const {imgSavePath, imgGetAddr} = require('../constant/constant')

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
      resJson.data.visualList = docs.visualPage
      res.json(resJson)

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
  let base64Url = visualData.visualPageImgBase64.replace(/^data:image\/png;base64,/, "") // 截图的base64编码
  let binaryData = new Buffer(base64Url, 'base64').toString('binary')
  let imgUrl = `${imgSavePath}/${visualData.visualPageId}.png`
  // 同时进行多个异步操作,全部完成时回调,回调结果为多个异步返回的结果的对象集
  async.parallel(
    {
      user: function (callback) {
        Users.findOne(
          {"_id": userId, "visualPage.visualPageId": visualData.visualPageId},
          ["visualPage.$"],
          function (err, docs) {
            if (err) console.log(err)
            if (!docs) { // 不存在id则添加
              Users.updateOne(
                {"_id": userId},
                {
                  $push: {
                    "visualPage": {
                      "visualPageId": visualData.visualPageId,
                      "visualPageName": visualData.visualPageName,
                      "visualPageImg": `${imgGetAddr}/${visualData.visualPageId}.png`
                    }
                  }
                },
                function (err, docs) {
                  callback(err, docs)
                }
              )
            } else { // 存在则修改
              Users.updateOne(
                {"_id": userId, "visualPage.visualPageId": visualData.visualPageId},
                {
                  $set: {
                    "visualPage.$.visualPageName": visualData.visualPageName,
                    "visualPage.$.visualPageImg": `${imgGetAddr}/${visualData.visualPageId}.png`
                  }
                },
                function (err, docs) {
                  callback(err, docs)
                }
              )
            }
          }
        )
      },
      visualPage: function (callback) {
        let visualPageData = {
          visualPageName: visualData.visualPageName,
          chartsList: visualData.chartsList,
          chartsGlobalSetting: visualData.chartsGlobalSetting
        }
        VisualPage.updateOne(
          {"visualPageId": visualData.visualPageId},
          {$set: {"visualPageData": visualPageData}},
          {upsert: true},
          function (err, docs) {
            callback(err, docs)
          })
      },
      saveImg: function (callback) {
        fs.writeFile(imgUrl, binaryData, 'binary', function (err) {
          callback(err)
        })
      }
    },
    function (e, r) {
      if (e) console.log(e, r)
      resJson.data.saveSuccess = true
      res.json(resJson)
    }
  )
})

/* 查看用户的可视化页面,通过id获取数据 */
router.post('/viewVisualPage', (req, res) => {
  let reqJson = req.body
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let visualPageId = reqJson.visualPageId
  VisualPage.findOne(
    {"visualPageId": visualPageId},
    function (err, docs) {
      if (err) console.log(err)
      if (!docs) {
        resJson.data.hasPage = false
        resJson.data.message = "visualPageId不存在!"
        res.json(resJson)
      }
      resJson.data.hasPage = true
      resJson.data.visualData = docs
      res.json(resJson)
    }
  )
})

/* 删除用户的可视化页面,通过id删除 */
router.post('/delVisualPage', (req, res) => {
  let reqJson = req.body
  let resJson = {
    "status": 'ok',
    "message": '',
    "data": {}
  }
  let userId = mongoose.Types.ObjectId(decodeToken(req).userid)
  let visualPageId = reqJson.visualPageId
  let imgDeletePath = `${imgSavePath}/${visualPageId}.png`
  async.parallel({
    user: function (callback) {
      Users.updateOne(
        {"_id": userId},
        {
          $pull: {
            "visualPage": {"visualPageId": visualPageId}
          }
        },
        function (err, docs) {
          callback(err, docs)
        }
      )
    },
    visualPage: function (callback) {
      VisualPage.remove(
        {"visualPageId": visualPageId},
        function (err, docs) {
          callback(err, docs)
        }
      )
    },
    deleteImg: function (callback) {
      fs.unlink(imgDeletePath, function (err) {
        callback(err)
      })
    }
  }, function (err, docs) {
    if (err) console.log(err + docs)
    resJson.data.delSuccess = true
    res.json(resJson)
  })
})

module.exports = router

