import request from '@/schedule/utils/publicRequest.js'

export function getEquipments (projectId) {
  return request({
    url: '/equipment/list',
    method: 'GET',
    params: {
      projectId
    }
  })
}
