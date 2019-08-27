'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROLL_BAR: '"f90f60f1fb114062a224d0a4d0be677d"'
})
