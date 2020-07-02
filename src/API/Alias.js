import request from '@/utils/publicRequest'

/**
 * get data source list
 */
export function getValueAlias (columnId) {
  return request({
    url: `/alias/value/${columnId}`,
    method: 'GET'
  })
}

/**
 * add value alias
 */
export function saveValueAlias (aliasInfo) {
  return request({
    url: `/alias/value`,
    method: 'PATCH',
    data: aliasInfo
  })
}

/**
 * get data frame alias
 */
export function getDataFrameAlias (id) {
  return request({
    url: `/alias/dataframe/${id}`,
    method: 'GET'
  })
}

/**
 * save data frame alias
 * @param {Array} alias - 別名
 */
export function patchDataFrameAlias (alias) {
  return request({
    url: '/alias/dataframe',
    method: 'PATCH',
    data: alias
  })
}

/**
 * get column alias
 * @param {Number} id
 */
export function getColumnAliasInfoById (id) {
  return request({
    url: `/alias/column/${id}`,
    method: 'GET'
  })
}

/**
 * alter column alias
 * @param {Array} aliasInfo
 */
export function patchColumnAlias (aliasInfo) {
  return request({
    url: '/alias/column',
    method: 'PATCH',
    data: aliasInfo
  })
}
