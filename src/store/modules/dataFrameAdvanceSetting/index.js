import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    isShowSettingBox: false,
    displaySection: 'column',
    columnList: null
  },
  actions,
  mutations,
  getters
}
