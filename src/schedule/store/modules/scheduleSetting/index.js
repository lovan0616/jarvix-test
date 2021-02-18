import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    scheduleProjects: [],
    scheduleProjectId: 0,
    defaultSetting: null,
    equipments: null
  },
  actions,
  mutations
}
