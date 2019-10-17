var express = require('express')
var router = express.Router()
const Api = require('../models/users')

/* api接口路由 */
router.get('/login', (req, res) => {
  Api.find().then(users => {
    res.json(users)
  })
})

module.exports = router

