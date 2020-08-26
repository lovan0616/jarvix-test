import { getSetting, setSetting, downloadCurrentSetting } from '@/schedule/API/Setting'
import { getEquipments } from '@/schedule/API/Equipment'

export default {
  getSetting () {
    return getSetting()
  },
  setSetting ({ rootState }, settings) {
    return setSetting(settings)
  },
  getEquipments () {
    return getEquipments()
  },
  downloadCurrentSetting ({ state }, fileId) {
    return downloadCurrentSetting(fileId)
  }
}
