<template>
  <div>
    <h1>Home</h1>
    <div>
      <button @click="sendEmail">发送邮件测试</button>
    </div>
    <Chat />
  </div>
</template>

<script setup>
import http from '@/http'
import Chat from '@/components/chat/chat.vue'
const sendEmail = async () => {
  try {
    await http.get('/send-email', {
      params: {
        email: '857717575@qq.com',
        name: 'svivi',
        link: 'https://web.chrisworkalx.top/birthday',
      },
    })
  } catch (e) {
    console.log('e', e)
  }
}
</script>

<style lang="scss" scoped></style>
