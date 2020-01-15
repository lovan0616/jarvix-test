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
 * get task
 */
export function getTask (path, data) {
  return request({
    url: path,
    method: 'POST',
    data
  })
}
