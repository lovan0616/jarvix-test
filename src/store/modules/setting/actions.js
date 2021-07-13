import { refreshToken } from '@/API/User'
import { getSystemInfo } from '@/API/Admin'

export default {
  async checkToken ({ commit, state }) {
    const newTime = Date.now()
    const isTokenStale = (oldTime, newTime, freshPeriod = 60) => {
      return newTime - oldTime >= freshPeriod * 60 * 1000
    }

    // Init timestamp
    if (!state.tokenTimestamp) {
      commit('updateTokenTimestamp', newTime)
      return
    }

    // Token is not expired
    if (!isTokenStale(state.tokenTimestamp, newTime)) {
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
    const { accessToken } = await refreshToken()
    localStorage.setItem('token', accessToken)
    commit('updateToken', accessToken)
    commit('updateTokenTimestamp', newTime)
    done()
    commit('updateTokenRefreshPromise', null)
  },
  checkSystemInfo ({ state }) {
    getSystemInfo().then(response => {
      state.isSmtpConnected = response.isSmtpConnected
    })
  }
}
