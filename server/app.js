//导入了一些使用的node库
var createError = require('http-errors')
var express = require('express')
var bodyParser = require('body-parser') // 解析用req.body获取的post参数
var path = require('path')//用来解析文件和目录的核心node库
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var ejs = require('ejs')
const jwtAuth = require('./token/jwt');

require('./db') // 引入数据库连接配置

//然后require()的是用户路由目录的模块。这些模块用来处理特定
//的“路由”（URL路径）。可以通过添加新文件来扩展骨架应用，
var apiRouter = require('./routes/api')

//用导入的express模块来创建app对象
var app = express()

// 然后使用它来设置视图（模板）引擎
//首先设置‘views’以制定模板的存储文件夹（此处设为子文件夹/views）
app.set('views', path.join(__dirname, 'views'))
//然后设置‘view engine’以制定模板库（‘html’）
app.engine('html', ejs.__express)
app.set('view engine', 'html')

//下一组app.use()调用将中间件库添加进请求处理链。
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
//除了之前导入的第三方库之外，我们还是用express.static中间件将
//项目根目录下所有静态文件托管至/public目录
app.use(express.static(path.join(__dirname, 'public')))

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 所有请求过来都会进行身份验证
app.use(jwtAuth);

//所有中间件都已设置完毕，现在把（之前导入的）路由处理器添加到请求处理链中。
//从而为网站的不同部分定义具体的路由：
app.use('/api', apiRouter)

// 拦截器
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
// 错误处理器
app.use((err, req, res) => {
  // set locals, only providing error in development
  // 设置 locals，只在开发环境提供错误信息
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // 渲染出错页面
  res.render('error.html')
})

//Express 应用对象（app）现已完成配置。最后一步是将其添加到
// exports 模块（使它可以通过 /bin/www 导入）。
module.exports = app
