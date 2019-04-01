import request from '@/utils/request'

/**
 * 登入
 */
export function login (loginInfo) {
  return request({
    url: '/login',
    method: 'POST',
    data: loginInfo
  })
}
