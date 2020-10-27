import request from '@/utils/publicRequest'

/**
 * 取得資料表所有欄位 primary alias 編輯範本
 * @param {Number} dataFrameId - 欲更新的資料表 id
 */
export function fetchPrimaryAliasTemplate (dataFrameId) {
  return request({
    url: `/automationScript/primaryAlias/${dataFrameId}`,
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 更新資料表所有欄位 primary alias
 * @param {formData} fileData - 編輯後的範本檔案
 * @param {Number} dataFrameId - 欲更新的資料表 id
 */
export function updatePrimaryAliasTemplate (fileData, dataFrameId) {
  return request({
    url: `/automationScript/primaryAlias/${dataFrameId}`,
    method: 'POST',
    data: fileData
  })
}

/**
 * 取得資料表 boolean & category 欄位數據編輯範本
 * @param {Number} dataFrameId - 欲更新的資料表 id
 */
export function fetchBooleanAndCategoryValueAliasTemplate (dataFrameId) {
  return request({
    url: `/automationScript/booleanAndCategoryValueAlias/${dataFrameId}`,
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 更新資料表 boolean & category 欄位數據
 * @param {formData} fileData - 編輯後的範本檔案
 * @param {Number} dataFrameId - 欲更新的資料表 id
 * @param {Number} groupId - 所在專案 id
 */
export function updateBooleanAndCategoryValueAliasTemplate (fileData, groupId, dataFrameId) {
  return request({
    url: `/automationScript/booleanAndCategoryValueAlias/${dataFrameId}`,
    method: 'PATCH',
    data: fileData,
    params: { groupId }
  })
}