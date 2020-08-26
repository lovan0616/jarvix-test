import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    defaultSetting: null,
    equipments: null
  },
  actions,
  mutations
}
