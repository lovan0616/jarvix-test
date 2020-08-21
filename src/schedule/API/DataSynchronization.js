import request from '@/schedule/utils/publicRequest.js'

export function dataSync () {
  return request({
    url: '/data/synchronize',
    method: 'POST'
  })
}

export function checkDataSyncProgress () {
  return request({
    url: '/data/synchronize/check',
    method: 'GET'
  })
}

export function cancelDataSync () {
  return request({
    url: '/data/synchronize/cancel',
    method: 'GET'
  })
}
