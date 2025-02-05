<template>
  <div class="user-page">
    <div v-for="(value, key) in state" :key="value">
      <span>{{ key }}: </span>
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import http from '@/http'

const state = reactive({
  username: '',
  role: '',
})

const getUser = async () => {
  const res = await http.get('/user')
  Object.assign(state, res.data)
}

onMounted(() => {
  getUser()
})
</script>

<style lang="scss" scoped>
.user-page {
  color: red;
}
</style>
