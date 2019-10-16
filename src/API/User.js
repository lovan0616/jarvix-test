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

/**
 * 登出
 */
export function logout () {
  return request({
    url: '/logout',
    method: 'GET'
  })
}
