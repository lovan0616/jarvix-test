import i18n from '@/lang/index.js'
import { Message } from 'element-ui'

export const acceptCSVFileTypes = {
  data () {
    return {
      acceptFileTypes: [
        '.csv',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
    }
  }
}

export function convertTimeStamp (timeStamp = new Date().getTime()) {
  if (!timeStamp) return '-'
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${year}/${month}/${day} ${hour}:${minute}`
}

export function validateSimulationSetting (settingInfo) {
  // 0.0 欄位未填
  for (let i = 0; i < settingInfo.excludeEquipments.length; i++) {
    // 0.1 排除機台未選
    if (!settingInfo.excludeEquipments[i].equipmentId) {
      Message({
        message: '未選排除機台',
        type: 'warning',
        duration: 3 * 1000
      })
      return false
    }
    for (let j = 0; j < settingInfo.excludeEquipments[i].reasons.length; j++) {
      // 0.2 排除時段未選
      if (!settingInfo.excludeEquipments[i].reasons[j].startDatetime ||
          !settingInfo.excludeEquipments[i].reasons[j].endDatetime) {
        Message({
          message: i18n.t('schedule.errorMessage.emptyExcludedPeriod'),
          type: 'warning',
          duration: 3 * 1000
        })
        return false
      }
    }
  }
  // 1. 機台重複
  const eqIds = settingInfo.excludeEquipments.map(e => e.equipmentId)
  if (new Set(eqIds).size < eqIds.length) {
    Message({
      message: i18n.t('schedule.errorMessage.duplicatedExcludedEquipment'),
      type: 'warning',
      duration: 3 * 1000
    })
    return false
  }
  // 2. URL未填
  if (!settingInfo.syncUrl) {
    Message({
      message: i18n.t('schedule.errorMessage.emptySyncURL'),
      type: 'warning',
      duration: 3 * 1000
    })
    return false
  }
  // 3. KPI 值重複
  if (Object.values(settingInfo.kpiSetting).sort().toString() !== [1, 2, 3, 4].toString()) {
    Message({
      message: i18n.t('schedule.errorMessage.duplicatedKPI'),
      type: 'warning',
      duration: 3 * 1000
    })
    return false
  }
  return true
}
