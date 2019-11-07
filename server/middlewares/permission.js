const decodeToken = require('../token/decodeToken')
// const Permission = require('../models/permission') // 权限表
const getRouterList = require('../utils/router').getRouterList
const getInquire = require('../utils/index').getInquire

// 验证用户访问路由是否有权限
module.exports = function (req, res, next) {
  let reqPath = req.path.substring(4)
  let roles = ['all']
  getRouterList(getInquire(roles)).then(generalRouter => {
    if (generalRouter.includes(reqPath)) {
      next()
    } else {
      let decoded = decodeToken(req) // 解码token，获得其中的身份信息
      roles = decoded.roles
      getRouterList(getInquire(roles)).then(permissionRouter => {
        if (permissionRouter.includes(reqPath)) {
          next()
        } else {
          res.status(401).json({'error': "401"})
        }
      })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({'error': "500"})
  })
}
