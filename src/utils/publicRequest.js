import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

/**
 * 注意這邊 headers 取 token 的寫法
 * 來源： https://github.com/axios/axios/issues/1383
 * 主要是為了讓每個 request 每次都會去拿 localStorage 的資料
 * 避免 token 過期了，結果還在拿 instance 建立時的 token 使用
 */
const service = axios.create({
  baseURL: window.env.PUBLIC_API_ROOT_URL, // api 的 base_url
  // timeout: 15000,
  headers: {
    access_token: {
      toString () {
        return localStorage.getItem('token')
      }
    },
    'Accept-Language': {
      toString () {
        return localStorage.getItem('locale')
      }
    }
  }
})

// 攔截 response
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success) return res.meta.pagination ? {...res.data, ...res.meta} : res.data

    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(res))
    }

    if (res.error) {
      Message({
        message: res.error.type === 'warning' ? res.error.message : i18n.t('errorMessage.defaultMsg'),
        type: res.error.type,
        duration: 3 * 1000
      })
    }

    return Promise.reject(res)
  },
  error => {
    if (error.response && error.response.status === 401) {
      store.commit('dataSource/setIsInit', false)
      store.commit('setting/setUserPermission', false)
      this.$store.commit('userManagement/clearUserInfo')
      router.push('/login')

      Message({
        message: i18n.t('errorMessage.authFail'),
        type: 'error',
        duration: 3 * 1000
      })
    }

    // cancel request
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message)
      return Promise.reject(error)
    }
    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(error))
    }

    return Promise.reject(error)
  }
)

export default service
