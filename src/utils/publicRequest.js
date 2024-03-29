import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'
import { v4 as uuidv4 } from 'uuid'

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
    },
    trace_key: {
      toString () {
        return uuidv4()
      }
    }
  }
})

service.interceptors.request.use(
  async config => {
    // Skip when calling `refresh token api` to avoid infinite recursion
    if (config.method === 'put' && config.url === 'auth/refresh') {
      return config
    }
    await store.dispatch('setting/checkToken')
    return config
  }
)

// 攔截 response
service.interceptors.response.use(
  response => {
    // 檔案下載
    if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return { data: response.data }
    if (!response.data.error && response.headers['content-type'] === 'application/octet-stream;charset=utf-8') return { data: response.data }
    const res = response.data
    if (res.success && !res.meta) return res.data // 特殊情況 光電展 response 無 meta
    if (res.success && !res.hasOwnProperty('data')) return res.success // 特殊情況 PATCH:/alert/conditions/timezone response 無 data
    if (res.success) return res.meta.pagination ? { ...res.data, ...res.meta } : res.data

    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.prototype.$rollbar.error(JSON.stringify(res))
    }

    if (res.error) {
      let messageString
      let stackTrace = res.error.stackTrace
      if (stackTrace) {
        const blob = new Blob([stackTrace], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        messageString = `<p style="font-size: 14px;">${res.error.message || i18n.t('errorMessage.defaultMsg')}</p>
          <a href="${url}" class="link" download="errors-log">${i18n.t('errorMessage.errorMessageDownload')}</a>`
      } else {
        messageString = res.error.type === 'warning' ? res.error.message : i18n.t('errorMessage.defaultMsg')
      }

      Message({
        dangerouslyUseHTMLString: !!stackTrace,
        message: messageString,
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

      switch (statusCode) {
        case 401:
          // 避免單一頁面多個請求，token 失效被登出時跳出多個訊息
          if (router.currentRoute.path === '/login') return Promise.reject(error)
          store.commit('dataSource/setIsInit', false)
          store.commit('userManagement/clearUserInfo')
          localStorage.removeItem('token')
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
      Vue.prototype.$rollbar.error(JSON.stringify(error))
    }

    return Promise.reject(error)
  }
)

export default service
