import Vue from 'vue'
import Router from 'vue-router' // 路由
import NotFound from '@/pages/NotFound' // 404
import Index from '@/pages/Index' // 主页
import DataVisual from "@/pages/DataVisual" // 数据可视化页面
import ClusterDetection from "../pages/ClusterDetection" // 集群检测页面
import Login from "../pages/Login" // 登录页面

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'menu-active',
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Index,
      redirect: {
        path: '/cluster'
      },
      children: [
        {
          path: '/data_visual',
          component: DataVisual
        },
        {
          path: '/cluster',
          component: ClusterDetection
        }
      ]
    },
    {
      path: '/404',
      component: NotFound,
      hidden: true
    },
    {
      path: '*',
      hidden: true,
      redirect: {path: '/404'}
    },
  ]
})

export default router
