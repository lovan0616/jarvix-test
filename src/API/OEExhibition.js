import request from '@/utils/publicRequest'

export function test1 () {
  return request({
    url: `/demo/demo1`,
    method: 'GET'
  })
}
