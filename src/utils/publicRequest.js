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
const API_URL = window.env.SAME_ORIGIN ? `${window.location.protocol}//${window.location.hostname}:8081/` : window.env.PUBLIC_API_ROOT_URL
const service = axios.create({
  baseURL: API_URL, // api 的 base_url
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

let oldToken
service.interceptors.request.use(
  async config => {
    oldToken = localStorage.getItem('token')
    await store.dispatch('setting/checkToken')
    return config
  }
)

// 攔截 response
service.interceptors.response.use(
  response => {
    // 檔案下載
    if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return { data: response.data }
    const res = response.data
    // 特殊情況 光電展 response 無 meta
    if (res.success && !res.meta) return res.data
    if (res.success) return res.meta.pagination ? {...res.data, ...res.meta} : res.data

    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(res))
    }

    if (res.error) {
      Message({
        message: res.error.type === 'warning' ? res.error.message : i18n.t('errorMessage.defaultMsg'),
        type: res.error.type,
        duration: 3 * 1000,
        showClose: true
      })
    }

    return Promise.reject(res)
  },
  async error => {
    // cancel request
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    if (!error.response) {
      // network error
      Message({
        message: i18n.t('errorMessage.networkError'),
        type: 'error',
        duration: 3 * 1000,
        showClose: true
      })
    } else {
      const statusCode = error.response.status
      const originalRequest = error.config

      switch (statusCode) {
        case 401:
          if(!originalRequest._retry && oldToken !== store.state.setting.token) {
            originalRequest._retry = true
            try {
              return await service(originalRequest)
            } catch (err) {
              return Promise.reject(error)
            }
          }
          
          // 避免單一頁面多個請求，token 失效被登出時跳出多個訊息
          if (router.currentRoute.path === '/login') return Promise.reject(error)
          store.commit('dataSource/setIsInit', false)
          store.commit('userManagement/clearUserInfo')
          router.push('/login')

          Message({
            message: i18n.t('errorMessage.authFail'),
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })

          break
        case 403:
          store.commit('dataSource/setIsInit', false)
          store.commit('dataSource/setDataSourceId', null)
          store.commit('userManagement/clearUserInfo')
          router.push('/login')

          Message({
            message: i18n.t('errorMessage.permissionChanged'),
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })

          break
      }
    }

    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(error))
    }

    return Promise.reject(error)
  }
)

export default service
