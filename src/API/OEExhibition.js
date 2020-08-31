import request from '@/utils/publicRequest'

export function getRandomChart () {
  return request({
    url: `/demo/demo1`,
    method: 'GET'
  })
}