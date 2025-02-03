<template>
  <div class="error-page">
    <h1>401 - 未授权</h1>
    <p>你没有访问该页面的权限，请先登录。</p>
    <router-link to="/login">去登录</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  margin-top: 50px;
}
</style>
