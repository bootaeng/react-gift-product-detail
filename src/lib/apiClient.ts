import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const message =
      error?.response?.data?.message || '서버 오류가 발생했습니다.'
    console.error(`HTTP error! status: ${status}`)
    return Promise.reject(new Error(message))
  }
)

export const apiClient = {
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    const res = await instance.get(url, config)
    return res.data.data ?? res.data
  },
  post: async <T = any>(url: string, body?: any, config?: any): Promise<T> => {
    const res = await instance.post(url, body, config)
    return res.data.data ?? res.data
  },
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await instance.put(url, data, config)
    return res.data.data ?? res.data
  },
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    const res = await instance.delete(url, config)
    return res.data.data ?? res.data
  },
}
