import axios, { type AxiosResponse } from 'axios'
import { useAuthStore, useUserStore } from '@/store'

const service = axios.create({
  // api请求会带上该前缀
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `${token}`

    const userId = useUserStore().userInfo?.userId
    if (userId)
      config.headers.user_id = `${userId}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
