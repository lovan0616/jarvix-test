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