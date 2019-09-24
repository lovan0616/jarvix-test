import request from '@/utils/request'

/**
 * 取得使用者資訊
 */
export function getProfile () {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}
/**
 * 更新使用者資訊
 */
export function setProfile (profile) {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data: profile
  })
}
