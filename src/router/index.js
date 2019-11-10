import Vue from 'vue'
import Router from 'vue-router' // 路由

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {title: '用户登录'},
    component: () => import("@/pages/Login"),
  },
  {
    path: '/404',
    name: 'notFound',
    meta: {title: '404-error'},
    component: () => import("@/pages/NotFound"),
    hidden: true
  },

]

/**
 * asyncRoutes 异步路由
 * the routes that need to be dynamically loaded based on user roles 根据用户角色权限动态改变用户可访问的路由
 */

export const asyncRoutes = [
  {
    path: '/',
    component: () => import("@/pages/Index"),
    redirect: {
      path: '/cluster'
    },
    children: [
      {
        path: '/visual_list',
        name: 'visualList',
        meta: {title: '数据可视化列表'},
        component: () => import("@/pages/VisualList"),
      },
      {
        path: '/cluster',
        name: 'cluster',
        meta: {title: 'hadoop集群检测', roles: ['admin']},
        component: () => import("@/pages/ClusterDetection"),
      }
    ]
  },
  {
    path: '/data_visual',
    name: 'dataVisual',
    meta: {title: '大数据可视化工具'},
    component: () => import("@/pages/DataVisual"),
  },
  {
    path: '/view_visual',
    name: 'viewVisual',
    meta: {title: '数据可视化页面'},
    component: () => import("@/pages/ViewVisual")
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  },
]

const createRouter = () => new Router({
  linkActiveClass: 'menu-active',
  mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
