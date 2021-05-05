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
  // 0 欄位未填
  for (let i = 0; i < settingInfo.excludeEquipments.length; i++) {
    // 0.1 排除機台未選
    if (!settingInfo.excludeEquipments[i].equipment) {
      Message({
        message: i18n.t('schedule.errorMessage.emptyExcludeEquipment'),
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
  const eqIds = settingInfo.excludeEquipments.map(e => e.equipment)
  if (new Set(eqIds).size < eqIds.length) {
    Message({
      message: i18n.t('schedule.errorMessage.duplicatedExcludedEquipment'),
      type: 'warning',
      duration: 3 * 1000
    })
    return false
  }
  // 2. KPI 值重複
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

export function snakeToCamel (variable) {
  if (!variable) return ''
  return variable.toLowerCase().replace(/(\w)(_)(\w)/g, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
}

export function snakeToPascal (variable) {
  if (!variable) return ''
  let s = snakeToCamel(variable)
  return `${s[0].toUpperCase()}${s.slice(1)}`
}

export function pascalToCamel (variable) {
  if (!variable) return ''
  return `${variable[0].toLowerCase()}${variable.slice(1)}`
}

export function pascalToSnake (variable) {
  if (!variable) return ''
  return variable.split(/(?=[A-Z])/).join('_').toLowerCase()
}
