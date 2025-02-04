<template>
  <div class="user-page">User</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/http'

const getUser = async () => {
  const res = await http.get('/user')
  console.log(res)
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
