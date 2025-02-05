import { defineStore } from 'pinia'
import http from '@/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
  },
  actions: {
    async login(username, password) {
      const { data } = await http.post('/auth/login', { username, password })

      console.log('data', data)
      this.token = data.token
      this.role = data.role
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
    },
    async register(username, password) {
      return await http.post('/auth/register', { username, password })
    },
    async logout() {
      await http.post('/auth/logout')
      this.token = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
  },
})
