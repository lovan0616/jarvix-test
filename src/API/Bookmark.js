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
