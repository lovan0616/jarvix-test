import request from '@/utils/request'

/**
 * get bookmarks
 */
export function getBookmarks () {
  return request({
    url: '/bookmarks',
    method: 'GET'
  })
}

/**
 * get bookmark by id
 */
export function getBookmarkById (bookmarkId) {
  return request({
    url: `/bookmarks/${bookmarkId}`,
    method: 'GET'
  })
}

/**
 * suggestions
 */
export function getSuggestions (id) {
  return request({
    url: '/suggestions',
    method: 'GET',
    params: {
      bookmark_id: id
    }
  })
}

/**
 * quickstarts
 */
export function getQuickstarts (id) {
  return request({
    url: '/quickstarts',
    method: 'GET',
    params: {
      bookmark_id: id
    }
  })
}

/**
 * get bookmarks table by id
 */
export function getBookmarkTablesById (bookmarkId) {
  return request({
    url: `/bookmarks/${bookmarkId}/tables`,
    method: 'GET'
  })
}

/**
 * get bookmarks table data
 */
export function getBookmarkTableDataById (bookmarkId, bookmarkTableId) {
  return request({
    url: `/bookmarks/${bookmarkId}/tables/${bookmarkTableId}`,
    method: 'GET'
  })
}

/**
 * create bookmark
 */
export function createBookmark (bookmarkInfo) {
  return request({
    url: '/bookmarks',
    method: 'POST',
    data: bookmarkInfo
  })
}

/**
 * delete bookmark
 */
export function deleteBookmark (bookmarkId) {
  return request({
    url: `/bookmarks/${bookmarkId}`,
    method: 'DELETE'
  })
}

/**
 * change bookmark name
 */
export function renameBookmark (bookmarkId, name) {
  return request({
    url: `/bookmarks/${bookmarkId}`,
    method: 'PUT',
    data: {
      name
    }
  })
}

/**
 * create bookmark storage
 */
export function createBookmarkStorage (bookmarkId, type) {
  return request({
    url: `/bookmarks/${bookmarkId}/edit`,
    method: 'POST',
    data: {
      type
    }
  })
}

/**
 * rename csv
 */
export function renameCSV (bookmarkId, uploadId, filename) {
  return request({
    url: `bookmarks/${bookmarkId}/CSV/upload/${uploadId}`,
    method: 'PUT',
    data: {
      filename
    }
  })
}
