import { getSetting, setSetting, downloadCurrentSetting } from '@/schedule/API/Setting'
import { syncProductionProgress } from '@/schedule/API/Bind'
import { getEquipments } from '@/schedule/API/Equipment'

export default {
  getSetting ({ state }) {
    return getSetting(state.scheduleProjectId)
  },
  setSetting ({ rootState }, settings) {
    return setSetting(settings)
  },
  getEquipments ({ state }) {
    return getEquipments(state.scheduleProjectId)
  },
  downloadCurrentSetting ({ state }, fileId) {
    return downloadCurrentSetting(fileId)
  },
  syncProductionProgress ({ state }) {
    return syncProductionProgress(state.scheduleProjectId)
  }
}
