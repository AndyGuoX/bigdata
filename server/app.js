//导入了一些使用的node库
var createError = require('http-errors')
var express = require('express')
var path = require('path')//用来解析文件和目录的核心node库
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var ejs = require('ejs')

require('./db') // 引入数据库连接配置

//然后require()的是用户路由目录的模块。这些模块用来处理特定
//的“路由”（URL路径）。可以通过添加新文件来扩展骨架应用，
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

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
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
//除了之前导入的第三方库之外，我们还是用express.static中间件将
//项目根目录下所有静态文件托管至/public目录
app.use(express.static(path.join(__dirname, 'public')))

//所有中间件都已设置完毕，现在把（之前导入的）路由处理器添加到请求处理链中。
//从而为网站的不同部分定义具体的路由：
app.use('/', indexRouter)
app.use('/users', usersRouter)
//注：这些路径（‘/’和‘users’）将作为导入路由的前缀。如果导入的模块
//users在/profile定义了路由，则可以在/users/profile访问该路由

// 最后一个中间件为错误和 HTTP 404 响应添加处理方法。
// 捕获 404 并抛给错误处理器
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
// 错误处理器
app.use((err, req, res, next) => {
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
