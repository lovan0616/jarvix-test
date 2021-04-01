import request from '@/utils/publicRequest'

/**
 * get model list
 * @query {Number} groupId - group id 
 * @query {Number} page - pagination page
 * @query {Number} size - pagination item per page
 */
 export function getModelList(groupId, page = 0, size = 20) {
  return request({
    url: `/models?groupId=${groupId}`,
    method: 'GET',
    params: {
      page,
      size
    }
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
 * @query {Number} modelId - model id 
 * @param {formData} modelData - 要重新上傳的 model
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
 * @param {Object} data - 建立的模型資訊
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
 * @query {Number} modelId - model id 
 */
 export function getModelInfo(modelId) {
  return request({
    url: `/models/${modelId}`,
    method: 'GET'
  })
}

/**
 * modify model info
 * @query {Number} modelId - model id 
 * @param {Object} data - 修改的模型資訊
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