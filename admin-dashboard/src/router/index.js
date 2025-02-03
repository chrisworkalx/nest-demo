import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import User from '@/views/User.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Forbidden from '@/views/403.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/403', component: Forbidden },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/403') // 未认证跳转到 403
  } else {
    next()
  }
})

export default router
