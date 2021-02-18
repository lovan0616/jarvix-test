import request from '@/schedule/utils/publicRequest.js'

export function dataSync (data) {
  return request({
    url: '/data/synchronize',
    method: 'POST',
    data
  })
}

export function checkDataSyncProgress (projectId) {
  return request({
    url: '/data/synchronize/check',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function cancelDataSync (data) {
  return request({
    url: '/data/synchronize/cancel',
    method: 'POST',
    data
  })
}
