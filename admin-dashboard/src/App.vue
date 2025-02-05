<script setup>
import { /**RouterLink， */ RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <nav class="nav">
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/user">访问用户</RouterLink>
    <RouterLink to="/register">注册</RouterLink>
    <RouterLink to="/login">登录</RouterLink>
    <RouterLink to="/logs">日志</RouterLink>
    <button @click="logout">退出登录</button>
  </nav>
  <RouterView />
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
