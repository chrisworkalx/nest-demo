import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

axios.defaults.baseURL = 'http://localhost:3000'
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})
