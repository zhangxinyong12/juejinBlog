import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/set',
    name: 'Set',
    component: () => import('@/views/Set.vue')
  },
  {
    path: '/auto-img',
    name: 'AutoImg',
    component: () => import('@/views/AutoImg.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
