import request from '@/utils/publicRequest'

/**
 * get columnSet list
 */
export function getColumnSetList (dataFrameId) {
  return request({
    url: `/columnSet/dataFrame/${dataFrameId}`,
    method: 'GET'
  })
}

/**
 * create columnSet
 */
export function createColumnSet (columnSetInfo) {
  return request({
    url: `/columnSet`,
    method: 'POST',
    data: columnSetInfo
  })
}

/**
 * delete columnSet
 */
export function deleteColumnSet (columnSetId) {
  return request({
    url: `/columnSet/${columnSetId}`,
    method: 'DELETE'
  })
}

/**
 * add columnSet column
 */
export function addColumnSetColumn (columnSetInfo) {
  return request({
    url: `/columnSet/column`,
    method: 'POST',
    data: columnSetInfo
  })
}

/**
 * remove columnSet column
 */
export function removeColumnSetColumn (columnSetColumnId) {
  return request({
    url: `/columnSet/column/${columnSetColumnId}`,
    method: 'DELETE'
  })
}
