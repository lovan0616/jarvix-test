import request from '@/utils/request'

/**
 * get current bookmark
 */
export function getBookmark () {
  return request({
    url: '/bookmark',
    method: 'GET'
  })
}

/**
 * set bookmark id
 */
export function setBookmarkById (idInfo) {
  return request({
    url: '/bookmark',
    method: 'PUT',
    data: idInfo
  })
}

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
export function getSuggestions () {
  return request({
    url: '/suggestions',
    method: 'GET'
  })
}

/**
 * quickstarts
 */
export function getQuickstarts () {
  return request({
    url: '/quickstarts',
    method: 'GET'
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
