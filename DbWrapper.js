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
      else console.log(`Added team: ${team.name}`)
    })
  }

  addPlayer (player) {
    const newPlayer = new model.Player(player)
    newPlayer.save((err, player) => {
      if (err) console.log(err)
      else console.info(`Added player: ${player.person.fullName}`)
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

  async getPlayersByTeamObjectId (teamObjectId) {
    return new Promise((resolve, reject) => {
      model.Player.find({team: teamObjectId}).lean().exec((err, roster) => {
        if (err) reject(err)
        else resolve(roster)
      })
    })
  }

  async getPlayerByObjectId (objectId) {
    return new Promise((resolve, reject) => {
      model.Player.findById(objectId).lean().exec((err, player) => {
        if (err) reject(err)
        else resolve(player)
      })
    })
  }

  async getTeamByObjectId (objectId) {
    return new Promise((resolve, reject) => {
      model.Team.findById(objectId).lean().exec((err, player) => {
        if (err) reject(err)
        else resolve(player)
      })
    })
  }

  addCalculation (type, datapoints) {
    const insertData = {
      dateCreated: new Date(),
      type,
      datapoints
    }
    const newCalculation = new model.Calculation(insertData)
    newCalculation.save((err, calc) => {
      if (err) console.error(err)
      // else console.log(calc)
    })
  }

  async getMostRecentTeamCalculation (type) {
    const populateOptions = { path: 'datapoints.args', model: 'Team' }
    return new Promise((resolve, reject) => {
      model.Calculation.findOne({type: type})
        .populate(populateOptions)
        .sort({date: -1})
        .lean()
        .exec((err, calc) => {
          if (err) reject(err)
          else resolve(calc)
        })
    })
  }

  async getMostRecentPlayerCalculation (type) {
    return new Promise((resolve, reject) => {
      model.Calculation.findOne({type: type}).populate('playerId').sort({date: -1}).lean().exec((err, calc) => {
        if (err) reject(err)
        else resolve(calc)
      })
    })
  }
}

module.exports = new DbWrapper()
