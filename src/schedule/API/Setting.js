import request from '@/schedule/utils/publicRequest.js'

/**
 * 取得後台設定
 * @param {Number} planId - 欲檢查的模擬方案 ID
 */
export function getSetting (projectId) {
  return request({
    url: '/setting/info',
    method: 'GET',
    params: {
      projectId
    }
  })
}

/**
 * 更新後台設定
 *  @param {Object} settingInfo - 設定資訊
 */
export function setSetting (data) {
  return request({
    url: '/setting/info',
    method: 'PUT',
    data
  })
}

export function getUploadFileList (projectId) {
  return request({
    url: '/uploadfile/list',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function uploadMultipleFiles (formData, cancelFunction) {
  return request({
    url: '/uploadfile/upload/rawdata/files',
    method: 'POST',
    data: formData,
    cancelToken: cancelFunction
  })
}

export function uploadSingleFile (formData) {
  return request({
    url: '/uploadfile/upload/constraint/file',
    method: 'POST',
    data: formData
  })
}

export function downloadCurrentSetting (fileId) {
  return request({
    url: `/uploadfile/download/${fileId}`,
    method: 'GET'
  })
}

export function uploadOrder (formData, cancelFunction) {
  return request({
    url: '/uploadfile/upload/rawdata/order',
    method: 'POST',
    data: formData,
    cancelToken: cancelFunction
  })
}
