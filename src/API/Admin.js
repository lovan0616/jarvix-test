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
