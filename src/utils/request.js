import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
import { errorsMessage } from './errorsMessage.js'
import i18n from '@/lang/index.js'

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
    // roolbar 留存
    Vue.rollbar.error(JSON.stringify(res))

    // 除了這些以外都不需要在這層級處理
    const messageCodeType = ['APPERR', 'SYERR', 'SYWARN']
    const needMessage = messageCodeType.reduce((count, type) => {
      count += res.error.code.indexOf(type) > -1 ? 1 : 0
      return count
    }, 0)
    if (!needMessage) return Promise.reject(res)

    // 這些也不用顯示message
    if (res.error.code.indexOf('APPERR') === 'APPERR0001' || res.error.code === 'SYERR0001' || res.error.code === 'SYWARN0001') return Promise.reject(res)

    // 如果 mapping 不到錯誤訊息，就顯示制式文字
    Message({
      message: errorsMessage[res.error.code] || i18n.t('message.systemIsError'),
      type: 'error',
      duration: 3 * 1000
    })

    switch (res.error.code) {
      case 'APPWARN0003':
        router.push('/login')
        break
    }
    return Promise.reject(res)
  },
  error => {
    // cancel request
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message)
      return Promise.reject(error)
    }
    // roolbar 留存
    Vue.rollbar.error(JSON.stringify(error))

    if (error.response) {
      Message({
        message: error.response.status + '-' + i18n.t('message.systemIsError'),
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
