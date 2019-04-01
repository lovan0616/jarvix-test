import request from '@/utils/request'

/**
 * ask question
 */
export function askQuestion (question) {
  return request({
    url: '/ask',
    method: 'POST',
    data: question
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
