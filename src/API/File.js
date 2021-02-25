import request from '@/utils/publicRequest'

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
export function fileUpload (fileData, onProgress, cancelFunction) {
  return request({
    url: '/files/upload',
    method: 'POST',
    data: fileData,
    onUploadProgress (progressEvent) {
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
export function fileImport (fileData, onProgress, cancelFunction) {
  return request({
    url: '/files/upload-parse',
    method: 'POST',
    data: fileData,
    onUploadProgress (progressEvent) {
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
 * analysis file
 * @param {Number} fileId - 檔案 ID
 * @param {Object} fileInfo - 檔案相關資訊
 */
export function analysisFile (fileId, fileInfo) {
  return request({
    url: `files/${fileId}/analyze`,
    method: 'POST',
    data: fileInfo
  })
}

/**
 * append file
 * @param {Number} fileId - 欲取得的 file ID
 * @param {Number} dataFrameId - 欲取得的資料源 ID
 */
export function appendFile (fileId, dataFrameId) {
  return request({
    url: `/files/${fileId}/append`,
    method: 'POST',
    data: {
      dataFrameId
    }
  })
}

/**
 * append file
 * @param {Number} fileId - 欲取得的 file ID
 * @param {Number} dataFrameId - 欲取得的資料源 ID
 */
export function reimportFile (fileId, dataFrameId) {
  return request({
    url: '/data/reimport',
    method: 'POST',
    data: {
      dataFrameId,
      fileId
    }
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

/**
 * get data summary
 */
export function getDataFrameSummary (dataFrameId) {
  return request({
    url: `/import/table/${dataFrameId}/summary`,
    method: 'GET'
  })
}
