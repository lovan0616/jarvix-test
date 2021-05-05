import request from '@/utils/publicRequest'

/**
 * get model flow list
 * @query {Number} groupId - group id 
 * @query {Number} page - pagination page
 * @query {Number} size - list size
 */
 export function getModelFlowList(groupId, page = 0, size) {
  return request({
    url: '/model-flows',
    method: 'GET',
    params: {
      groupId,
      page,
      size
    }
  })
}

export function getModelFlowDetail(modelFlowId) {
  return request({
    url: `model-flows/${modelFlowId}`,
    method: 'GET'
  })
}

/**
 * create model flow
 * @param {Object} data - 建立的流程資訊
 */
 export function createModelFlow(data) {
  return request({
    url: '/model-flows',
    method: 'POST',
    data
  })
}

/**
 * active model flow
 * @query {Number} modelFlowId - model flow id 
 */
 export function updateModelFlow(modelFlowId) {
  return request({
    url: `/model-flows/${modelFlowId}/update`,
    method: 'POST'
  })
}

export function deleteModelFlow(modelFlowId) {
  return request({
    url: `/model-flows/${modelFlowId}`,
    method: 'DELETE'
  })
}

export function getModelFlowUpdateLogs (modelFlowId, page = 0, size = 20) {
  return request({
    url: `/model-flows/${modelFlowId}/logs`,
    method: 'GET',
    params: {
      page,
      size
    }
  })
}