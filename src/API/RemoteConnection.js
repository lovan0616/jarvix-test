import request from '@/utils/publicRequest'

/**
 * 建立 DB 連線
 * @param {Object} connectInfo 連線資訊
 */
export function createDataBaseConnection (connectInfo) {
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
