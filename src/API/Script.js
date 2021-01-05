import request from '@/utils/publicRequest'

/**
 * script upload
 * @param {formData} fileData - 要上傳的 script 和 modal
 */
export function scriptUpload(fileData) {
  return request({
    url: '/scripts',
    method: 'POST',
    data: fileData
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

/**
 * get script list
 * @query {Number} groupId - group id 
 */
export function getScriptList(groupId) {
  return request({
    url: `/scripts?groupId=${groupId}`,
    method: 'GET'
  })
}

/**
 * get script Info
 * @params {Number} scriptId - script id
 */
export function getScripInfo(scriptId) {
  return request({
    url: `/scripts/${scriptId}/input-columns`,
    method: 'GET'
  })
}


/**
 * execute script
 * @params {Number} scriptId - script id
 */
export function executeScript(scriptId, data) {
  return request({
    url: `/scripts/${scriptId}/simulate`,
    method: 'POST',
    data
  })
}

/**
 * get column default value
 * @params {Number} scriptId - script id
 * @params {Number} dataColumnId - data column id
 */
export function searchColumnDefaultValue(scriptId, dataColumnId, data) {
  return request({
    url: `/scripts/${scriptId}/column/${dataColumnId}/search/value`,
    method: 'POST',
    data
  })
}