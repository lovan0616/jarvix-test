import request from '@/utils/publicRequest'

/**
 * ask question
 */
export function askQuestion (askInfo, cancelFunction) {
  return request({
    url: '/ask/question',
    method: 'POST',
    data: askInfo,
    cancelToken: cancelFunction
  })
}

/**
 * ask result
 */
export function askResult (askInfo, cancelFunction) {
  return request({
    url: '/ask/result',
    method: 'POST',
    data: askInfo,
    cancelToken: cancelFunction
  })
}

/**
 * get component list
 */
export function getComponentList (resultId, cancelFunction) {
  return request({
    url: `/ask/componentList/${resultId}`,
    method: 'GET',
    cancelToken: cancelFunction
  })
}

/**
 * get component data
 */
export function getComponentData (componentInfo, cancelFunction) {
  return request({
    url: `/ask/componentData`,
    method: 'POST',
    data: componentInfo,
    cancelToken: cancelFunction
  })
}

/**
 * get question history
 */
export function getHistoryQuestionList(dataSourceId, dataFrameId) {
  return request({
    url: `/ask/questionHistoryList/${dataSourceId}`,
    method: 'GET',
    params: {
      dataFrameId
    }
  })
}

/**
 * get related question
 * @param resultId
 */
export function getRelatedQuestionList(resultId, dataSourceId) {
  return request({
    url: `/ask/relatedQuestionList`,
    method: 'POST',
    data: {
      resultId,
      dataSourceId
    }
  })
}

/**
 * get quick start question
 */
export function getQuickStartQuestion(dataSourceId, dataFrameId) {
  return request({
    url: `/ask/quickQuestionList/${dataSourceId}`,
    method: 'GET',
    params: {
      dataFrameId
    }
  })
}

/**
 * add table to memory
 * @param {Number} accountId
 * @param {Number} dataFrameId,
 * @param {Number} dataSourceId
 */
export function addTableToMemory(accountId, dataFrameId, dataSourceId) {
  return request({
    url: `/inMemory`,
    method: 'POST',
    data: {
      accountId,
      dataFrameId,
      dataSourceId
    }
  })
}

