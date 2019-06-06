import request from '@/utils/request'

/**
 * ask question
 */
export function askQuestion (question, cancelFunction) {
  return request({
    url: '/ask',
    method: 'POST',
    data: question,
    cancelToken: cancelFunction
  })
}

/**
 * relate question
 */
export function relateQuestions (question, cancelFunction) {
  return request({
    url: '/relateQuestions',
    method: 'POST',
    data: question,
    cancelToken: cancelFunction
  })
}

/**
 * get history question list
 */
export function getHistoryQuestionList () {
  return request({
    url: '/ask/history',
    method: 'GET'
  })
}

/**
 * get related question question in preview
 */
export function getPreviewQuestions (questionInfo) {
  return request({
    url: '/preview/question',
    method: 'POST',
    data: questionInfo
  })
}

/**
 * get question preview object
 */
export function getQuestionPreview (questionInfo) {
  return request({
    url: '/ask/preview',
    method: 'POST',
    data: questionInfo
  })
}

/**
 * get chart data
 */
export function getTaskData (intent, entities) {
  return request({
    url: `/task/${intent}/data`,
    method: 'POST',
    data: entities
  })
}
