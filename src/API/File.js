import request from '@/utils/request'

/**
 * get file list
 * @param {String} dataSourceId - 欲取得的資料源 ID
 */
export function getFileList () {
  return request({
    url: '/files',
    method: 'GET'
  })
}

/**
 * file upload
 * @param {formData} fileData - 要上傳的資料表相關資料
 */
export function fileUpload (fileData) {
  return request({
    url: '/files/upload',
    method: 'POST',
    data: fileData
  })
}

/**
 * delete file
 */
export function deleteFile (fileId) {
  return request({
    url: `/files/upload/${fileId}`,
    method: 'POST'
  })
}
