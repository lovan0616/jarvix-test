import request from '@/utils/publicRequest'

/**
 * get join table list
 * @param {Number} dataSourceId - 資料源 ID
 */
export function getJoinTableList (dataSourceId) {
  return request({
    url: `/joinTable/dataSource/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * create single join table
 * @param {Object} inputData - 欲建立資料關聯的資料
 * @param {Array} inputData.dataFrameRelationList - 關聯表內容
 */
export function createJoinTable (inputData) {
  return request({
    url: '/joinTable',
    method: 'POST',
    data: inputData
  })
}

/**
 * update single join table
 * @param {Object} inputData - 欲更新資料關聯的資料
 * @param {Array} inputData.dataFrameRelationList - 關聯表內容
 */
export function updateJoinTable (inputData) {
  return request({
    url: '/joinTable',
    method: 'PUT',
    data: inputData
  })
}

/**
 * delete single join table
 * @param {Number} joinTableId - 資料源 ID
 */
export function deleteJoinTable (joinTableId) {
  return request({
    url: `/joinTable/${joinTableId}`,
    method: 'DELETE'
  })
}
