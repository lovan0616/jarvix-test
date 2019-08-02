import request from '@/utils/request'

/**
 * ask question
 */
export function askChatBot (data, cancelFunction) {
  return request({
    url: '/chatbot/ask',
    method: 'POST',
    data,
    cancelToken: cancelFunction
  })
}
