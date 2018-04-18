const model = require('./model.js')
const mongoose = require('mongoose')
const config = require('config')
const dbConfig = config.get('dbConfig')

class DbWrapper {
  connect (callback) {
    if (dbConfig.user) {
      mongoose.connect(
        `mongodb+srv://${dbConfig.user.username}:${dbConfig.user.password}@${dbConfig.host}/${dbConfig.dbName}`,
        callback)
    } else {
      mongoose.connect(
        `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`,
        callback)
    }
  }

  addTeam (team) {
    const newTeam = new model.Team(team)
    newTeam.save((err, team) => {
      if (err) console.log(err)
      else console.log(`Added team ${team.name}`)
    })
  }

  addPlayer (player) {
    const newPlayer = new model.Player(player)
    newPlayer.save((err, player) => {
      if (err) console.log(err)
      else {
        // console.info('added player:', player);
      }
    })
  }

  async getAllTeams () {
    return new Promise((resolve, reject) => {
      model.Team.find({}).lean().exec((error, teamsArray) => {
        if (error) reject(error)
        else resolve(teamsArray)
      })
    })
  }

  async getPlayersByTeamId (teamId) {
    return new Promise((resolve, reject) => {
      model.Player.find({teamId}).lean().exec((err, roster) => {
        if (err) reject(err)
        else resolve(roster)
      })
    })
  }

  async getPlayerByObjectId (playerId) {
    return new Promise((resolve, reject) => {
      model.Team.findById(playerId).lean().exec((err, player) => {
        if (err) reject(err)
        else resolve(player)
      })
    })
  }

  addCalculation (type, data) {
    const insertData = {
      date: new Date(),
      type,
      data
    }
    const newCalculation = new model.Calculation(insertData)
    newCalculation.save((err, calc) => {
      if (err) console.error(err)
      else console.log(calc)
    })
  }
}

module.exports = new DbWrapper()
