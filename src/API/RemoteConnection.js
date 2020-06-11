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
 * 依照連線資訊 ID 刪除連線資訊
 * @param {Number} databaseConnectionId 連線 id
 */
export function deleteDatabaseConnection (databaseConnectionId) {
  return request({
    url: `/database/connection/${databaseConnectionId}`,
    method: 'DELETE'
  })
}

/**
 * 依照連線資訊 ID 更新連線資訊
 * @param {Number} databaseConnectionId 連線 id
 * @param {Object} connectInfo 更改資訊
 */
export function updateDatabaseConnection (databaseConnectionId, connectInfo) {
  return request({
    url: `/database/connection/${databaseConnectionId}`,
    method: 'PUT',
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
export function getConnectionInfoList (groupId) {
  return request({
    url: `/database/connection`,
    method: 'GET',
    params: {
      groupId
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
export function testOldConnection (connectionId, cancelFunction=null) {
  return request({
    url: `/database/connection/${connectionId}/test`,
    method: 'POST',
    cancelToken: cancelFunction
  })
}

/**
 * 解析 table
 * @param {Number} connectionId - 連線 id
 * @param {String} tableName - table 名稱
 */
export function analyzeTable (connectionId, dataSourceId, tableName) {
  return request({
    url: `/database/connection/${connectionId}/dataSource/${dataSourceId}/table/${tableName}/analysis`,
    method: 'POST'
  })
}
