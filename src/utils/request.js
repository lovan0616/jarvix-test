import axios from 'axios'
import router from '../router'

/**
 * 注意這邊 headers 取 token 的寫法
 * 來源： https://github.com/axios/axios/issues/1383
 * 主要是為了讓每個 request 每次都會去拿 localStorage 的資料
 * 避免 token 過期了，結果還在拿 instance 建立時的 token 使用
 */
const service = axios.create({
  baseURL: window.env.API_ROOT_URL + 'api/', // api 的 base_url
  // timeout: 15000,
  headers: {
    token: {
      toString () {
        return localStorage.getItem('token')
      }
    }
  }
})

// 攔截 response
service.interceptors.response.use(
  response => {
    const res = response.data

    if (!res.error) return res.data

    switch (res.error.code) {
      case 'APPWARN0003':
        return router.push('/login')
      default:
        // return Promise.reject(response)
    }
  },
  error => {
    if (!error.response.status) return Promise.reject(error)
    switch (error.response.status) {
      case 403:
        return router.push('/login')
      default:
        return Promise.reject(error)
    }
  }
)

export default service
