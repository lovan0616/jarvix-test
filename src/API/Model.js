import request from '@/utils/publicRequest'

/**
 * get model list
 * @query {Number} groupId - group id 
 */
 export function getModelList(groupId) {
  return request({
    url: `/models?groupId=${groupId}`,
    method: 'GET'
  })
}

/**
 * model upload
 * @param {formData} modelData - 要上傳的 model
 */
 export function uploadModel(modelData) {
  return request({
    url: '/models',
    method: 'POST',
    data: modelData
  })
}

/**
 * re-upload model
 */
 export function reUploadModel(modelId, data) {
  return request({
    url: `/models/${modelId}`,
    method: 'POST',
    data
  })
}

/**
 * create model
 */
 export function createModel(data) {
  return request({
    url: '/models/create',
    method: 'POST',
    data
  })
}

/**
 * get model info
 */
 export function getModelInfo(modelId) {
  return request({
    url: `/models/${modelId}`,
    method: 'GET'
  })
}

/**
 * modify model info
 */
 export function modifyModelInfo(modelId, data) {
  return request({
    url: `/models/${modelId}`,
    method: 'PATCH',
    data
  })
}

/**
 * delete model
 * @params {Number} modelId - model id 
 */
 export function deleteModelById(modelId) {
  return request({
    url: `/models/${modelId}`,
    method: 'DELETE'
  })
}