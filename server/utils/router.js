const Permission = require('../models/permission') // 权限表

/**
 * @param {Object} roles
 * @returns {Array}
 */

/* 根据用户角色获取相应权限的路由 */
function getRouterList(roles) {
  return new Promise((resolve, reject) => {
    Permission.find({$or: roles}, function (err, router) {
      if (err) {
        reject(err)
      } else if (!router) {
        resolve([])
      }
      let routerList = []
      for (let item of router) {
        routerList = [...routerList, ...item.routerList] // es6 合并数组
      }
      resolve(routerList)
    })
  })
}

module.exports = {
  getRouterList,

}
