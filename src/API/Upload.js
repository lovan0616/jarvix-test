import request from '@/utils/request'

/**
 * upload csv
 */
export function uploadCSV (storageId, uploadId) {
  return request({
    url: `/storages/${storageId}/CSV/upload/${uploadId}`,
    method: 'POST'
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
 * get storage
 */
export function getStorage (bookmarkId) {
  return request({
    url: `/bookmarks/${bookmarkId}/edit`,
    method: 'POST'
  })
}

/**
 * publish storage
 */
export function publishStorage (storageId, bookmarkId) {
  return request({
    url: `/storages/${storageId}/build`,
    method: 'POST',
    data: {
      bookmark_id: bookmarkId
    }
  })
}
