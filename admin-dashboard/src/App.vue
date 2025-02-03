<script setup>
import { /**RouterLink， */ RouterView } from 'vue-router'
</script>

<template>
  <nav class="nav">
    <RouterLink to="/user">访问用户</RouterLink>
    <RouterLink to="/register">注册</RouterLink>
    <RouterLink to="/login">登录</RouterLink>
    <RouterLink to="/logs">日志</RouterLink>
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
