import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    isShowSettingBox: false,
    columnList: [],
    filterList: []
  },
  actions,
  mutations,
  getters
}
