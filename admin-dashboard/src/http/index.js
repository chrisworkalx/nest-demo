import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '../router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    // console.log('response', response)
    return response.data.result || {}
  },
  (error) => {
    if (error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      const { pathname, search } = location
      const { fullPath } = router.resolve(`${pathname}${search}`)
      console.log('fullPath', fullPath)
      router.replace({
        path: '/login',
        query: {
          redirect: fullPath,
        },
      })
    }
    return Promise.reject(error)
  },
)

export default instance
