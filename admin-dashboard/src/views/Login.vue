<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit">
      <p>
        <label for="username">姓名：</label>
        <input type="text" name="username" placeholder="Username" v-model="logInfo.username" />
      </p>
      <p>
        <label for="password">密码：</label>
        <input type="password" name="password" placeholder="Password" v-model="logInfo.password" />
      </p>
      <p style="text-align: center">
        <button type="submit">提交</button>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const logInfo = reactive({
  username: '',
  password: '',
})
async function handleSubmit() {
  await authStore.login(logInfo.username, logInfo.password)
  logInfo.username = ''
  logInfo.password = ''
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
}
</style>
