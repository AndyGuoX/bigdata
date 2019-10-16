var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.post('/post', (req, res) => {
  res.send('haha')
})

module.exports = router