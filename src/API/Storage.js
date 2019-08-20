import request from '@/utils/request'

/**
 * get storage
 */
export function getBookmarkStorage (bookmarkId, type) {
  return request({
    url: `/bookmarks/${bookmarkId}/edit`,
    method: 'POST',
    data: {
      type
    }
  })
}

/**
 * build storage
 */
export function buildStorage (storageId, bookmarkId, syncable = true) {
  return request({
    url: `/storages/${storageId}/build`,
    method: 'POST',
    data: {
      bookmark_id: bookmarkId,
      syncable: syncable
    }
  })
}

/**
 * delete csv
 */
export function deleteCSV (storageId, uploadId) {
  return request({
    url: `/storages/${storageId}/CSV/upload/${uploadId}`,
    method: 'DELETE'
  })
}

/**
 * connect remote database
 */
export function dbConnect (storageId, connectInfo) {
  return request({
    url: `/storages/${storageId}/SQLITE/db`,
    method: 'PUT',
    data: connectInfo
  })
}

/**
 * upload csv
 */
export function uploadCSV (storageId, uploadId, data, onProgress, cancelFunction) {
  return request({
    url: `/storages/${storageId}/CSV/upload/${uploadId}`,
    method: 'POST',
    data,
    onUploadProgress (progressEvent) {
      let percentCompleted = Math.round((progressEvent.loaded * 100) /
        progressEvent.total)

      // execute the callback
      if (onProgress) onProgress(percentCompleted)
      return percentCompleted
    },
    cancelToken: cancelFunction
  })
}

/**
 * set CSV join
 */
export function setCSVJoin (storageId, joinInfo) {
  return request({
    url: `/storages/${storageId}/CSV/joins`,
    method: 'POST',
    data: joinInfo
  })
}

/**
 * update column setting
 * 欄位前後有可能有空白，所以先用 encodeURIComponent 處理空白編碼
 */
export function updateCSVColumnSetting (storageId, tableId, columnKey, columnInfo) {
  return request({
    url: `/storages/${storageId}/CSV/tables/${tableId}/columns/${encodeURIComponent(columnKey)}`,
    method: 'PUT',
    data: columnInfo
  })
}
