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

/**
 * 更新 accountLicense
 * @param {Number} id - account id
 * @param {String} newLicense - newLicense
 */
export function updateLicense (id, newLicense) {
  const accountId = id || store.getters['userManagement/getCurrentAccountId']
  return request({
    url: `/account/${accountId}/license`,
    method: 'PUT',
    data: {
      newLicense
    }
  })
}
