import request from '@/utils/publicRequest'

/**
 * 建立 DB 連線
 * @param {Object} connectInfo 連線資訊
 */
export function createDatabaseConnection (connectInfo) {
  return request({
    url: '/database/connection',
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
    url: `/database/connection/${databaseConnectionId}/table`,
    method: 'GET'
  })
}

/**
 * get record connection list
 */
export function getConnectionInfoList (dataSourceId) {
  return request({
    url: `/database/connection`,
    method: 'GET',
    params: {
      dataSourceId
    }
  })
}

/**
 * 測試資料連線
 */
export function testConnection (connectionInfo) {
  return request({
    url: `/database/connection/test`,
    method: 'POST',
    data: connectionInfo
  })
}

/**
 * 測試已新增的連線
 */
export function testOldConnection (connectionId) {
  return request({
    url: `/database/connection/${connectionId}/test`,
    method: 'POST'
  })
}

/**
 * 解析 table
 * @param {Number} connectionId - 連線 id
 * @param {String} tableName - table 名稱
 */
export function analyzeTable (connectionId, tableName) {
  return request({
    url: `/database/connection/${connectionId}/table/${tableName}/analysis`,
    method: 'POST'
  })
}
