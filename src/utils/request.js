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
  baseURL: window.env.API_ROOT_URL + 'api/', // api 的 base_url
  // timeout: 15000,
  headers: {
    access_token: {
      toString () {
        return localStorage.getItem('token')
      }
    },
    'Accept-Language': localStorage.getItem('locale')
  }
})

// 攔截 response
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.error) return res.data

    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(res))
    }

    // 這些也不用顯示message
    if (res.error.code === 'APPERR0001' || res.error.code === 'SYERR0001' || res.error.code === 'SYWARN0001' || res.error.code.indexOf('TASKWARN') > -1
    ) return Promise.reject(res)

    // 如果 mapping 不到錯誤訊息，就顯示制式文字
    Message({
      message: i18n.t(`errorMessage.${res.error.code}`) || i18n.t('message.systemIsError'),
      type: 'error',
      duration: 3 * 1000
    })

    switch (res.error.code) {
      case 'APPWARN0003':
        store.commit('dataSource/setIsInit', false)
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
    // rollbar 留存
    if (window.location.hostname !== 'localhost') {
      Vue.rollbar.error(JSON.stringify(error))
    }

    return Promise.reject(error)
  }
)

export default service
