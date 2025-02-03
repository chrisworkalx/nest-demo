<template>
  <div class="error-page">
    <h1>404 - 页面未找到</h1>
    <p>你访问的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  margin-top: 50px;
}
</style>
