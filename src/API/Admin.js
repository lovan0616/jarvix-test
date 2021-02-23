import request from '@/utils/publicRequest'

/**
 * 取得帳戶資訊
 */
export function getAccountList () {
  return request({
    url: `/admin/accounts`,
    method: 'GET'
  })
}

/**
 * 產生重設密碼連結
 * @param {Number} targetUserId - user id
 */
export function createChangePasswordLink (targetUserId) {
  return request({
    url: `/admin/password-reset-link`,
    method: 'POST',
    data: {
      targetUserId
    }
  })
}

/**
 * 取得系統資訊
 */
export function getSystemInfo () {
  return request({
    url: `/management/info`,
    method: 'GET'
  })
}
