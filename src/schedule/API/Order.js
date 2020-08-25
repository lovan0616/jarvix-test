import request from '@/schedule/utils/publicRequest.js'

export function getOrderList ({ page = 0, size = 20, orderNumber = null, startDate, endDate }) {
  return request({
    url: '/order/list',
    method: 'GET',
    params: {
      page,
      size,
      orderNumber,
      startDate,
      endDate
    }
  })
}