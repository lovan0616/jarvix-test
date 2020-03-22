import request from '@/utils/publicRequest'

/**
 * 建立 DB 連線
 * @param {Object} connectInfo 連線資訊
 */
export function createDatabaseConnection (connectInfo) {
  return request({
    url: 'copyTable/databaseConnection',
    method: 'POST',
    data: connectInfo
  })
}

/**
 * 取得 table 列表
 * @param {Number} databaseConnectionId 連線 id
 */
export function getTableList (databaseConnectionId) {
  return request({
    url: `copyTable/${databaseConnectionId}`,
    method: 'GET'
  })
}

/**
 * 取得 column 列表
 * @param {Object} connectionInfo 連線資訊
 */
export function getTableColumnList (connectionInfo) {
  return request({
    url: `copyTable/column`,
    method: 'POST',
    data: connectionInfo
  })
}
