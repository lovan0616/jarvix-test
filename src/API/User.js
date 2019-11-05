import request from '@/utils/request'

/**
 * 登入
 */
export function login (loginInfo) {
  return request({
    url: 'auth/login',
    method: 'POST',
    data: loginInfo
  })
}

/**
 * 登出
 */
export function logout () {
  return request({
    url: 'auth/logout',
    method: 'GET'
  })
}
