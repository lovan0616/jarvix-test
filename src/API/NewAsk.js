import request from '@/utils/publicRequest'

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
