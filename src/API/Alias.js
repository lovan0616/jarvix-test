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
 * 
 */
export function getDataFrameInfo (dataFrameId) {
  return request({
    url: `/${dataFrameId}/framedata`,
    method: 'GET'
  })
}
