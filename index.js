const mongoose = require('mongoose')
const app = require('express')()
const db = require('./DbWrapper')
const api = require('./ApiWrapper')
const calc = require('./Calculations')
const NHLStats = require('./NHLStats')

const main = function () {
  const nhlStats = new NHLStats()
}

main()
