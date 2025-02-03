import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import User from '@/views/User.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Forbidden from '@/views/403.vue'
import UnAuthPage from '@/views/401.vue'
import NotPage from '@/views/404.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/logs', component: () => import('@/views/Logs.vue'), meta: { requiresAuth: true } },
  { path: '/403', component: Forbidden },
  { path: '/401', component: UnAuthPage },
  { path: '/404', component: NotPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('to', to)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/403')
  } else {
    next()
  }
})

export default router
