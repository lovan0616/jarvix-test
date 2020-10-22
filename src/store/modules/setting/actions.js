import { refreshToken } from '@/API/User'

export default {
  checkToken ({ commit, state }) {
    // refresh token
    const newTime = new Date().getTime()
    if (!state.tokenTimestamp) {
      commit('updateTokenTimestamp', newTime)
      return Promise.resolve(state) 
    }
    
    const isTokenStale = (oldTime, newTime, freshPeriod = 60) => {
      return newTime - oldTime >= freshPeriod * 60 * 1000
    }
    if (isTokenStale(state.tokenTimestamp, newTime)) {
      commit('updateTokenTimestamp', newTime)
      return refreshToken()
        .then(({ accessToken }) => {
          commit('updateToken', accessToken) 
          localStorage.setItem('token', accessToken)
        })   
    }
    return Promise.resolve(state)
  }
}
