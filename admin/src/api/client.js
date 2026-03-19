import axios from 'axios'
import { getAdminToken, clearAdminToken } from '../store/auth.js'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Lazy import router to avoid circular dependencies
let _router = null
export function setRouter(router) {
  _router = router
}

api.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAdminToken()
      if (_router) _router.push('/')
    }
    return Promise.reject(err)
  }
)

export default api
