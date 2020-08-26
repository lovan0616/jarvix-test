import request from '@/utils/publicRequest'

/**
 * 將問句結果加入戰情室 Pool
 * @param {String} id - 戰情室 ID
 * @param {Object} data - result 資訊
 */
export function addResultToWarRoomPool(id, data) {
  return request({
    url: `/war-room/${id}/pool/item`,
    method: 'POST',
    data
  })
}

/**
 * 從戰情室 Pool 刪除指定問句結果
 * @param {String} id - 戰情室 ID
 * @param {String} id - 欲刪除的問句結果
 */
export function removeResultFromWarRoomPool(id, itemId) {
  return request({
    url: `/war-room/${id}/pool/item/${itemId}`,
    method: 'DELETE'
  })
}

/**
 * 新增專案戰情室
 * @param {Object} data - war room 資訊
 */
export function createWarRoom(data) {
  return request({
    url: '/war-room',
    method: 'POST',
    data
  })
}

/**
 * 取得戰情室列表
 * @param {String} id - 戰情室 ID
 */
export function getWarRoomList() {
  return request({
    url: `/war-room/list`,
    method: 'GET'
  })
}

/**
 * 取得指定戰情室內容
 * @param {String} id - 戰情室 ID
 */
export function getWarRoomInfo(id) {
  return request({
    url: `/war-room/${id}`,
    method: 'GET'
  })
}

/**
 * 取得指定發布戰情室
 * @param {String} urlIdentifier - 發布戰情室 URL 辨識字串
 */
export function getPublishedWarRoomInfo(urlIdentifier) {
  return request({
    url: `/war-room/publishing/${urlIdentifier}`,
    method: 'GET'
  })
}

/**
 * 取得戰情室 Pool 所有物件
 * @param {String} id - 戰情室 ID
 */
export function getWarRoomPool(id) {
  return request({
    url: `/war-room/${id}/pool/items`,
    method: 'GET'
  })
}

/**
 * 刪除戰情室
 * @param {String} id - 戰情室 ID
 */
export function deleteWarRoom(id) {
  return request({
    url: `/war-room/${id}`,
    method: 'DELETE'
  })
}

/**
 * 變更戰情室設定
 * @param {String} id - 戰情室 ID
 * @param {Object} data - 戰情室設定
 */
export function updateWarRoomSetting(id, data) {
  return request({
    url: `/war-room/${id}/config`,
    method: 'PATCH',
    data
  })
}

/**
 * 變更戰情室排版
 * @param {String} id - 戰情室 ID
 * @param {Object} data - 戰情室新排版
 */
export function updateWarRoomLayout(id, data) {
  return request({
    url: `/war-room/${id}/layout`,
    method: 'PATCH',
    data
  })
}

/**
 * 變更戰情室排版
 * @param {String} id - 戰情室 ID
 * @param {Object} data - 戰情室新名稱
 */
export function updateWarRoomName(id, data) {
  return request({
    url: `/war-room/${id}/name`,
    method: 'PATCH',
    data
  })
}

/**
 * 取得戰情室 Component內容
 * @param {String} id - 戰情室 ID
 * @param {String} componentId - 戰情室 Component ID
 */
export function getComponentInfo(id, componentId) {
  return request({
    url: `/war-room/${id}/component/${componentId}`,
    method: 'GET'
  })
}

/**
 * 取得指定發布戰情室 Component
 * @param {String} urlIdentifier - 發布戰情室 URL 辨識字串
 * @param {String} componentId - 戰情室 Component ID
 */
export function getPublishedComponentInfo(urlIdentifier, componentId) {
  return request({
    url: `/war-room/publishing/${urlIdentifier}/component/${componentId}`,
    method: 'GET'
  })
}

/**
 * 建立戰情室 Component
 * @param {String} id - 戰情室 ID
 * @param {Object} data - 戰情室 Component 設定
 */
export function createComponent(id, data) {
  return request({
    url: `/war-room/${id}/component`,
    method: 'POST',
    data
  })
}

/**
 * 刪除戰情室 Component
 * @param {String} id - 戰情室 ID
 * @param {String} componentId - 戰情室 Component ID
 */
export function deleteComponent(id, componentId) {
  return request({
    url: `/war-room/${id}/component/${componentId}`,
    method: 'DELETE'
  })
}

/**
 * 更新戰情室 Component 設定
 * @param {String} id - 戰情室 ID
 * @param {String} componentId - 戰情室 Component ID
 * @param {Object} data - 戰情室 Component 設定
 */
export function updateComponent(id, componentId, data) {
  return request({
    url: `/war-room/${id}/component/${componentId}/config`,
    method: 'PATCH',
    data
  })
}

/**
 * 發布戰情室
 * @param {String} id - 戰情室 ID
 */
export function publishWarRoom(id) {
  return request({
    url: `/war-room/${id}/publishing`,
    method: 'POST'
  })
}

/**
 * 取消發布戰情室
 * @param {String} id - 戰情室 ID
 */
export function unpublishWarRoom(id) {
  return request({
    url: `/war-room/${id}/withholding`,
    method: 'POST'
  })
}
