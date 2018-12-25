
export default class EchartAddon {
  constructor (map, plugins, fns) {
    this._map = { ...map, empty: {} }
    this._options = {}
    this._seriesItem = {}
    this._seriesData = {}
    this._seriesDataFns = []
    this.specialList = ['seriesItem', 'seriesData', 'seriesDataFns']
    this.specialDefaults = [{}, {}, []]
    this.plugins = plugins
    this.fns = fns
  }

  get map () {
    return this._map
  }

  set options (v) {
    this._options = v
  }

  get options () {
    return this._options
  }

  set seriesItem (v) {
    this._seriesItem = v
  }

  get seriesItem () {
    return this._seriesItem
  }

  set seriesData (v) {
    this._seriesData = v
  }

  get seriesData () {
    return this._seriesData
  }

  set seriesDataFns (v) {
    this._seriesDataFns = v
  }

  get seriesDataFns () {
    return this._seriesDataFns
  }

  save (mappingResult) {
    this.options = {}
    this.specialList.forEach((special, index) => {
      this[special] = this.specialDefaults[index]
    })
    Object.keys(mappingResult).forEach(key => {
      this.detectHandler(key)(key, mappingResult)
    })
    return this
  }

  detectHandler (key) {
    const isSpecial = this.specialList.find(special => special === key)
    if (isSpecial) return this[`${key}Handler`].bind(this)
    else return this['optionsHandler'].bind(this)
  }

  optionsHandler (key, mappingResult) {
    if (this.isObject(this.options[key]) && this.isObject(mappingResult[key])) {
      this.options[key] = this.mergeDeep(this.options[key], mappingResult[key])
    } else {
      this.options[key] = mappingResult[key]
    }
  }

  seriesItemHandler (key, mappingResult) {
    return this.specialValueHandler(key, mappingResult)
  }

  seriesDataHandler (key, mappingResult) {
    return this.specialValueHandler(key, mappingResult)
  }

  seriesDataFnsHandler (key, mappingResult) {
    return this.specialFnsHandler(key, mappingResult)
  }

  specialValueHandler (key, mappingResult) {
    if (this.isObject(this[key]) && this.isObject(mappingResult[key])) {
      this[key] = this.mergeDeep(this[key], mappingResult[key])
    } else {
      this[key] = mappingResult[key]
    }
  }

  specialFnsHandler (key, mappingResult) {
    this[key] = this[key].concat(mappingResult[key].map(config => {
      return this.fns[config.handler](...config.args)
    }))
  }

  mapping (target) {
    let result = {}
    if (typeof target === 'string') result = this.mappingWithString(target)
    else if (this.isObject(target)) result = this.mappingWithObject(target)
    else if (this.isArray(target)) result = this.mappingWithArray(target)
    return this.save(result)
  }

  mappingWithString (target, mixin) {
    mixin = this.handlePlugin(mixin)
    const { key, name } = this.getKeyAndName(target)
    const value = this.isObject(this._map[name])
      ? this.mergeDeep(this._map[name], mixin) || mixin
      : this._map[name] || mixin
    return {
      [key]: value
    }
  }

  mappingWithObject (target) {
    return Object.keys(target).reduce((accu, curr) => {
      const d = this.mappingWithString(curr, target[curr])
      return this.mergeDeep(accu, d)
    }, {})
  }

  mappingWithArray (target) {
    return target.reduce((accu, curr) => {
      let d
      if (this.isKeyValue(curr)) d = this.mappingWithString(curr.key, curr.value)
      else d = this.mappingWithString(curr)
      return this.mergeDeep(accu, d)
    }, {})
  }

  isKeyValue (target) {
    return (target.hasOwnProperty('key') && target.hasOwnProperty('value'))
  }

  getKeyAndName (str) {
    const g = /^([^-]+):(.*)/.exec(str)
    const key = g[1] || str
    const name = (g.length > 1) ? g[0] : 'empty'
    return { key, name }
  }

  /**
  * Performs a deep merge of objects and returns new object. Does not modify
  * objects (immutable) and merges arrays via concatenation.
  *
  * @param {...object} objects - Objects to merge
  * @returns {object} New object with merged key/values
  */
  mergeDeep (...objects) {
    const isObject = obj => obj && typeof obj === 'object'
    return objects.reduce((prev, obj) => {
      if (obj === undefined) obj = {}
      Object.keys(obj).forEach(key => {
        const pVal = prev[key]
        const oVal = obj[key]
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal)
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal)
        } else {
          prev[key] = oVal
        }
      })
      return prev
    }, {})
  }

  isObject (target) {
    return typeof target === 'object' && !(target instanceof Array)
  }

  isArray (target) {
    return Array.isArray(target)
  }

  handlePlugin (value) {
    if (this.isObject(value)) {
      Object.keys(value).forEach(key => {
        value[key] = this.handlePlugin(value[key])
      })
    } else if (this.isArray(value)) {
      value.forEach((item, index) => {
        value[index] = this.handlePlugin(item)
      })
    } else if (typeof value === 'string' && value.indexOf('this.plugins.') > -1) {
      /* eslint-disable */
      value = eval(value)
      /* eslint-enable */
    }
    return value
  }
}
