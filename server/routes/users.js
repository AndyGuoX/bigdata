var express = require('express')
var router = express.Router()
const Users = require('../models/users')

/* GET users listing. */
router.get('/cool', (req, res, next) => {
  Users.find().then(users => {
    console.log(users)
    res.json(users)
  })
})

module.exports = router

