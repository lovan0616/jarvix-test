import request from '@/utils/request'

/**
 * get bookmark column
 */
export function getBookmarkColumn (bookmarkId) {
  return request({
    url: `bookmarks/${bookmarkId}/tokens`,
    method: 'GET'
  })
}
