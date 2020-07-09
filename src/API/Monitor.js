import request from '@/utils/publicRequest'

/**
 * get monitor setting
 */
export function getMonitorSetting (componentId) {
  return request({
    url: '/monitor',
    method: 'GET',
    params: {
      componentId
    }
  })
}

/**
 * new monitor setting
 */
export function newMonitorSetting (data) {
  return request({
    url: '/monitor',
    method: 'POST',
    data
  })
}

/**
 * update monitor setting
 */
export function updateMonitorSetting (data) {
  return request({
    url: '/monitor',
    method: 'PATCH',
    data
  })
}
  