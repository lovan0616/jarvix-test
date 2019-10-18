import { logout } from '@/API/User'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('bookmark/setIsInit', false, {root: true})
      commit('bookmark/setBookmarkId', null, {root: true})
      localStorage.removeItem('token')
    })
  }
}
