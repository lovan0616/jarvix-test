import { refreshToken } from '@/API/User'

export default {
  checkToken ({ commit, state }) {
    console.log('***********checkToken')
    // refresh token
    const newTime = new Date().getTime()
    if (!state.tokenTimestamp) commit('updateTokenTimestamp', newTime)
    
    const isTokenStale = (oldTime, newTime, freshPeriod = 0.1) => {
      return newTime - oldTime >= freshPeriod * 60 * 1000
    }
    if (isTokenStale(state.tokenTimestamp, newTime)) {
      console.log('***********stale')
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
