export function deepClone (obj = {}) {
  if (!obj || obj === true || typeof (obj) !== 'object') return obj
  let result = Array.isArray(obj) ? [] : !obj.constructor ? {} : new obj.constructor()
  if (obj instanceof Map) {
    for (let key of obj.keys()) {
      result.set(key, deepClone(obj.get(key)))
    }
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) result[key] = deepClone(obj[key])
  }
  return result
}

export function deepMergeObj (target, source) {
  target = deepClone(target)
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (let key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], deepMergeObj(target[key], source[key]))
  }
  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}

/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function mergeDeep (...objects) {
  const isObject = obj => obj && typeof obj === 'object'
  return objects.reduce((prev, obj) => {
    if (obj === undefined) obj = {}
    Object.keys(obj).forEach(key => {
      const pVal = prev[key]
      const oVal = obj[key]
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })
    return prev
  }, {})
}

export function copyToClickBoard (element) {
  let input = element
  input.select()
  /* For mobile devices */
  input.setSelectionRange(0, 99999)
  document.execCommand('copy')
}

export function isObject (target) {
  return typeof target === 'object' && !(target instanceof Array)
}

export function isArray (target) {
  return Array.isArray(target)
}

// 英數字或是空白
export function isEnOrEnum (target) {
  return /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/.test(target)
}

// 檔案狀態
export const uploadStatus = {
  // 等待上傳
  wait: 'wait',
  // 禁止上傳
  forbidden: 'forbidden',
  // 上傳中
  uploading: 'uploading',
  // 上傳成功
  success: 'success',
  // 上傳失敗
  fail: 'fail',
  // 資料處理中
  processing: 'processing',
  // 上傳結束
  finished: 'finished'
}

export const importType = {
  LOCAL: 'import_file',
  REMOTE: 'import_database'
}

export const statsTypeList = ['CATEGORY', 'NUMERIC', 'BOOLEAN', 'DATETIME']

export const statsTypeOptionList = [
  { value: 'CATEGORY', name: 'Category' },
  { value: 'NUMERIC', name: 'Numeric' },
  { value: 'BOOLEAN', name: 'Boolean' },
  { value: 'DATETIME', name: 'Datetime' }
]

export const booleanOptionList = [
  { name: 'True', value: true },
  { name: 'False', value: false }
]

export const intentType = {
  OVERVIEW: 'OVERVIEW',
  CLUSTERING: 'CLUSTERING',
  PREDICTION: 'PREDICTION'
}

export const alertTargetType = {
  DATA_COLUMN: 'DATA_COLUMN',
  COMPONENT: 'COMPONENT'
}

export const algoConfig = {
  clustering: {
    '@type': 'ClusterAlgoConfig',
    clusteringCount: null
  },
  prediction: {
    '@type': 'PredictionAlgoConfig',
    predictionIntervalLength: '4'
  },
  anomaly: {
    '@type': 'AnomalyAlgoConfig',
    standardLineType: 'MEDIAN',
    stddevTimes: 3
  },
  stability: {
    '@type': 'StandardLineAlgoConfig',
    standardLineType: 'MEDIAN'
  }
}

export const sizeTable = {
  large: {
    'font-size': '80px',
    height: '83px',
    'line-height': '80px'
  },
  middle: {
    'font-size': '54px',
    height: '54px',
    'line-height': '54px'
  },
  small: {
    'font-size': '36px',
    height: '36px',
    'line-height': '36px'
  },
  mini: {
    'font-size': '28px',
    height: '28px',
    'line-height': '28px'
  }
}
