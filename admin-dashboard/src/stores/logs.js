import { defineStore } from 'pinia'
import http from '@/http'

export const useLogStore = defineStore('logs', {
  state: () => ({
    logs: [],
  }),
  actions: {
    async fetchLogs() {
      const { data } = await http.get('/logs')
      this.logs = data
    },
  },
})
