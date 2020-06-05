import request from '@/utils/publicRequest'
import store from '../store'

/**
 * 取得帳戶資訊
 */
export function getAccountInfo (id) {
  const accountId = id || store.getters['userManagement/getCurrentAccountId']
  return request({
    url: `/account/${accountId}`,
    method: 'GET'
  })
}
