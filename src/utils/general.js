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
  REMOTE: 'import_database',
  SCRIPT: 'import_script'
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
  PREDICTION: "PREDICTION"
}