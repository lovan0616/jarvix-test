import request from '@/utils/publicRequest'

/**
 * script upload
 * @param {formData} fileData - 要上傳的 script 和 modal
 */
export function scriptUpload(fileData, onProgress, cancelFunction) {
  return request({
    url: '/scripts',
    method: 'POST',
    data: fileData,
    onUploadProgress(progressEvent) {
      let percentCompleted = Math.round((progressEvent.loaded * 100) /
        progressEvent.total)

      // execute the callback
      if (onProgress) onProgress(percentCompleted)
      return percentCompleted
    },
    cancelToken: cancelFunction
  })
}

/**
 * file import
 * @param {formData} fileData - 要上傳的資料表相關資料
 */
export function scriptInit(fileData) {
  return request({
    url: '/scripts/init',
    method: 'POST',
    data: fileData
  })
}