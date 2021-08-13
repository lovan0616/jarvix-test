import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state () {
    return {
      isInit: false,
      isShowSettingBox: false,
      displaySection: 'column',
      columnList: null,
      filterList: [],
      shouldAdvanceDataFrameSettingRefetchDataColumn: false
    }
  },
  actions,
  mutations,
  getters
}
