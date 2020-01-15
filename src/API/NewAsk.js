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
export function getComponentData (componentId, cancelFunction) {
  return request({
    url: `/ask/componentData/${componentId}`,
    method: 'GET',
    cancelToken: cancelFunction
  })
}

/**
 * get question history
 */
export function getHistoryQuestionList (dataSourceId) {
  return request({
    url: `/ask/questionHistoryList/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * get related question
 * @param dataSourceId
 * @param question
 */
export function getRelatedQuestionList (questionInfo) {
  return request({
    url: `/ask/relatedQuestionList`,
    method: 'GET',
    data: questionInfo
  })
}
