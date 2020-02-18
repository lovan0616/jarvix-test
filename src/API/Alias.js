import request from '@/utils/publicRequest'

/**
 * get data source list
 */
export function getValueAlias (columnId) {
  return request({
    url: `/alias/get/ValueAlias/${columnId}`,
    method: 'GET'
  })
}

/**
 * add value alias
 */
export function saveValueAlias (aliasInfo) {
  return request({
    url: `/alias/alter/ValueAlias`,
    method: 'POST',
    data: aliasInfo
  })
}
