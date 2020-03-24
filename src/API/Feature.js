import request from '@/utils/publicRequest'

/**
 * get custom feature list
 */
export function getCustomFeatureList (dataFrameId) {
  return request({
    url: `/feature/customFeatureList/${dataFrameId}`,
    method: 'GET'
  })
}

/**
 * create custom feature
 */
export function createCustomFeature (featureInfo) {
  return request({
    url: `/feature/customFeature`,
    method: 'POST',
    data: featureInfo
  })
}

/**
 * update custom feature
 */
export function updateCustomFeature (featureInfo) {
  return request({
    url: `/feature/customFeature`,
    method: 'PUT',
    data: featureInfo
  })
}

/**
 * update system feature
 */
export function updateSystemFeature (featureInfo) {
  return request({
    url: `/feature/suggestFeature`,
    method: 'PUT',
    data: featureInfo
  })
}
