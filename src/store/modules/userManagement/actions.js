import { logout } from '@/API/User'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('dataSource/setIsInit', false, {root: true})
      commit('dataSource/setDataSourceId', null, {root: true})
      localStorage.removeItem('token')
    })
  }
}
