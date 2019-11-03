'use strict'
// const path = require('path')

// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

// vue.http.js 配置说明
module.exports = {
  // 将部署应用程序的基本URL
  // 将部署应用程序的基本URL。
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  publicPath: process.env.NODE_ENV === 'production'
    ? '/production-sub-path/'
    : '/',

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: 'dist',

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
      // '/foo': {
      //     target: '<other_url>'
      // }
    },  // 配置多个代理
  }
}
