import { getPinboardList, deletePinboard } from '@/API/Pinboard'

export default {
  getPinboardList ({ commit }) {
    return getPinboardList().then(res => {
      commit('setPinboardList', res.reports)
    })
  },
  deletePinboard ({ commit }, data) {
    return deletePinboard(data)
  }
}
