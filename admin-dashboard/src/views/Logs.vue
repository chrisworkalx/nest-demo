<script setup>
import { onMounted } from 'vue';
import { useLogStore } from '@/stores/logs';

const logStore = useLogStore();

onMounted(() => {
  logStore.fetchLogs();
});
</script>

<template>
  <div>
    <h2>系统日志</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>操作</th>
          <th>用户ID</th>
          <th>详情</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logStore.logs" :key="log.id">
          <td>{{ log.id }}</td>
          <td>{{ log.action }}</td>
          <td>{{ log.userId }}</td>
          <td>{{ log.details || '-' }}</td>
          <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
