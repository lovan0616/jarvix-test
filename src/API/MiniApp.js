import request from '@/utils/publicRequest'

/**
 * 取得 mini app 列表
 * @param {String} id - mini app ID
 */
export function getMiniAppList(groupId) {
  return request({
    url: `/app`,
    method: 'GET',
    params: {
      groupId
    }
  })
}

/**
 * 取得 mini app 內容
 * @param {String} id - mini app ID
 */
export function getMiniAppInfo(id) {
  return request({
    url: `/app/${id}`,
    method: 'GET'
  })
}

/**
 * 刪除 mini app
 * @param {String} id - mini app ID
 */
export function deleteMiniApp(id) {
  return request({
    url: `/app/${id}`,
    method: 'DELETE'
  })
}

/**
 * 建立 mini app
 * @param {Object} data - mini app 資訊
 */
export function createApp(data) {
  return request({
    url: `/app/create`,
    method: 'POST',
    data
  })
}

/**
 * 變更 mini app 資訊
 * @param {String} id - mini app ID
 * @param {Object} data - mini app 資訊
 */
export function updateAppSetting(id, data) {
  return request({
    url: `/app/${id}`,
    method: 'PATCH',
    data
  })
}

/**
 * 變更 mini app 名稱
 * @param {String} id - mini app ID
 * @param {Object} data - mini app 資訊
 */
export function updateAppName(id, data) {
  return request({
    url: `/app/${id}/name`,
    method: 'PATCH',
    data
  })
}
