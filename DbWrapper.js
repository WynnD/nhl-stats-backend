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

  async addTeam (team) {
    const newTeam = new model.Team(team)
    newTeam.save((err, team) => {
      if (err) console.log(err)
      else console.log(`Added team ${team.name}`)
    })
  }

  async addPlayer (player) {
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
      model.Team.find({}, (error, teamsArray) => {
        if (error) reject(error)
        else resolve(teamsArray)
      })
    })
  }

  async getPlayersByTeamId (teamId) {
    return new Promise((resolve, reject) => {
      model.Player.find({teamId: teamId}, (err, roster) => {
        if (err) reject(err)
        else resolve(roster)
      })
    })
  }

  async getPlayerByObjectId (playerId) {
    return new Promise((resolve, reject) => {
      model.Team.findById(playerId, (err, player) => {
        if (err) reject(err)
        else resolve(player)
      })
    })
  }
}

module.exports = new DbWrapper()
