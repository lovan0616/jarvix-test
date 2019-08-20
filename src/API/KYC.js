import request from '@/utils/request'

/**
 * ask KYC
 */
export function answerKYC (data) {
  return request({
    url: '/kyc/answer',
    method: 'POST',
    data
  })
}

/**
 * clean KYC
 */
export function cleanKYC () {
  return request({
    url: '/kyc',
    method: 'DELETE'
  })
}
