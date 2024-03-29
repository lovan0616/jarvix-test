import { refreshToken } from '@/API/User'
import { getSystemInfo } from '@/API/Admin'

export default {
  async checkToken ({ commit, state }) {
    if (!localStorage.getItem('token')) return

    const newTime = Date.now()
    const isTokenStale = (oldTime, newTime, freshPeriod = 60) => {
      return newTime - oldTime >= freshPeriod * 60 * 1000
    }

    // tokenTimestamp is existed and token is not expired
    if (state.tokenTimestamp && !isTokenStale(state.tokenTimestamp, newTime)) {
      return
    }

    // token refreshing is invoked by someone else and is pending
    if (state.tokenRefreshPromise !== null) {
      await state.tokenRefreshPromise
      return
    }

    let promise, done
    promise = new Promise((resolve) => {
      done = resolve
    })

    commit('updateTokenRefreshPromise', promise)

    try {
      const { accessToken } = await refreshToken()
      localStorage.setItem('token', accessToken)
      commit('updateTokenTimestamp', newTime)
    } catch (error) {
      console.error(error)
    }

    done()
    commit('updateTokenRefreshPromise', null)
  },
  checkSystemInfo ({ state }) {
    getSystemInfo().then(response => {
      state.isSmtpConnected = response.isSmtpConnected
    })
  }
}
