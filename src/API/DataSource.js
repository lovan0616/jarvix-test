import request from '@/utils/publicRequest'

/**
 * get data source list
 */
export function getDataSourceList () {
  return request({
    url: '/datasources',
    method: 'GET'
  })
}

/**
 * createDataSource
 * @param {String} name - 資料源名稱
 */
export function createDataSource (name) {
  return request({
    url: '/datasources',
    method: 'POST',
    data: {
      name
    }
  })
}

/**
 * get dataSource by id
 * @param {Number} dataSourceId - 欲取得的資料源 ID
 */
export function getDataSourceById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * check dataSource status by id
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function checkDataSourceStatusById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * get data frame by dataSourceId
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function getDataFrameById (dataSourceId) {
  return request({
    url: '/dataFrame',
    method: 'GET',
    params: {
      dataSourceId
    }
  })
}
