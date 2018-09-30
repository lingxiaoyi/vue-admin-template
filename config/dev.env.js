'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '""', //"development"
  BASE_API: '"https://easy-mock.com/project/5baf287fd71a4e533bffcff7"',
})
