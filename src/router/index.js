import Vue from 'vue'
import Router from 'vue-router' // 路由
import NotFound from '@/pages/NotFound' // 404
import Index from '@/pages/Index' // 主页
import DataVisual from "@/pages/DataVisual"; // 数据可视化页面

Vue.use(Router);

const router = new Router({
    linkActiveClass: 'menu-active',
    routes: [
        {
            path: '/',
            redirect: {path: '/index'}
        },
        {
            path: '/index',
            component: Index,
        },
        {
            path: '/data_visual',
            component: DataVisual
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
});

export default router;