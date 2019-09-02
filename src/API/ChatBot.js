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

/**
 * 取得對話紀錄
 */
export function getChatHistory (id) {
  return request({
    url: '/chatbot/history',
    method: 'GET',
    params: {
      chatbot_id: id
    }
  })
}
