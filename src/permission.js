import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get_page_title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // 注意：角色必须是对象数组！ 例如：['admin']或，['developer'，'editor']
          const {roles} = await store.dispatch('user/getUserInfo')

          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // 设置replace：true，因此导航将不会留下历史记录
          next({...to, replace: true})
        } catch (error) {
          // 删除令牌并进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error)
          next(`/login`)
        }
      }
    }
  } else {
    /* 没有Token */

    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单的路由不需要拦截
      next()
    } else {
      // 其他需要权限访问的页面一律重定向到登录页面
      next(`/login`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})


