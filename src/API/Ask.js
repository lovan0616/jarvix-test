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
