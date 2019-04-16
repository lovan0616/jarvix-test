import request from '@/utils/request'

/**
 * 取得資料
 */
export function queryResultData (data) {
  return request({
    url: '/query',
    method: 'POST',
    data
  })
}
