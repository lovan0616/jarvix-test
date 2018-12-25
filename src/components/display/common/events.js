import { mergeDeep, isArray, isObject } from '../../../sy-vue-ui/src/utils/general'

export function emitter (options) {
  if (isArray(options)) return e => options.forEach(o => emit.bind(this)(o, e))
  else if (isObject(options)) return e => emit.bind(this)(options, e)
}

function emit ({ eventName, eventArgs, eventArgsMap, taskNode }, e) {
  if (eventArgsMap !== undefined) {
    const extendEventArgs = mapToValue(eventArgsMap, e)
    if (extendEventArgs !== undefined) eventArgs = mergeDeep(eventArgs, extendEventArgs)
  }
  this.$events.$emit(eventName, { eventArgs, taskNode })
}

function mapToValue (map, e) {
  if (isObject(map)) {
    return Object.keys(map).reduce((result, key) => {
      if (typeof map[key] === 'object') {
        result[key] = mapToValue(map[key], e)
      } else {
        result[key] = e[map[key]]
      }
      return result
    }, {})
  } else if (isArray(map)) {
    return map.map(value => {
      if (typeof value === 'object') {
        return mapToValue(value, e)
      } else {
        return e[value]
      }
    })
  } else {
    return e[map]
  }
}
