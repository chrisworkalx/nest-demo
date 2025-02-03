import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      const { data } = await axios.post('/api/auth/login', { username, password })
      this.token = data.token
      localStorage.setItem('token', data.token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
