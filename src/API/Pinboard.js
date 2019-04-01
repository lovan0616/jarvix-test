import request from '@/utils/request'

/**
 * pin to pinboard
 */
export function updatePinboard (reportInfo) {
  return request({
    url: '/pin/report',
    method: 'PUT',
    data: reportInfo
  })
}

/**
 * delete from pinboard
 */
export function deletePinboard (id) {
  return request({
    url: '/pin/report',
    method: 'DELETE',
    data: id
  })
}

/**
 * get pinboard list
 */
export function getPinboardList () {
  return request({
    url: '/pin/reports',
    method: 'GET'
  })
}
