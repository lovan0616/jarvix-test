import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    isShowScheduleHelper: false,
    scheduleProjectId: null,
    defaultSetting: null,
    equipments: null
  },
  actions,
  mutations
}
