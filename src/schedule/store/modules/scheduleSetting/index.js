import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    scheduleProjects: [],
    scheduleProjectId: null,
    defaultSetting: null,
    equipments: null,
    isShowScheduleHelper: false,
    refErrorResultSizeLimit: 100, // 檢查資料時，預設向後端取的最多 refErrorValue 數量
    accessList: {
      cnRelease: [32, 38, 35, 41, 37, 33, 47]
    }
  },
  actions,
  mutations,
  getters
}
