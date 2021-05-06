import { getSetting, setSetting, downloadCurrentSetting } from '@/schedule/API/Setting'
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
  }
}
