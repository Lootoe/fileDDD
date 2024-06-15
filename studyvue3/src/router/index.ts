import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: () => import('@/views/Home.vue')
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes: routes
})
