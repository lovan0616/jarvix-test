import request from '@/schedule/utils/publicRequest.js'

export function getEquipments () {
  return request({
    url: '/equipment/list',
    method: 'GET'
  })
}
