const mongoose = require('mongoose')
const db = require('./DbWrapper')
const api = require('./ApiWrapper')
const calc = require('./Calculations')
const RequestHandler = require('./RequestHandler')

class NHLStats {
  constructor (requestHandler = new RequestHandler()) {
    try {
      db.connect(async () => {
        if (process.argv[2] === '-w') {
          mongoose.connection.db.dropDatabase()
          await this.fetchAllTeamsAndPlayers()
          await this.fetchPlayoffGamesByTeam()
        }
        this.requestHandler = requestHandler
      })
    } catch (e) {
      console.error(e)
    }
  }

  async fetchRoster (teamObjectId, teamApiId) {
    const roster = await api.getRoster(teamApiId)

    let playerIds = []
    for (const player of roster) {
      player._id = new mongoose.Types.ObjectId()
      player.team = teamObjectId
      await db.addPlayer(player)
      playerIds.push(player._id)
    }
    return playerIds
  }

  async fetchTeamWithRoster (team) {
    const teamObjectId = new mongoose.Types.ObjectId()
    const teamRoster = await this.fetchRoster(teamObjectId, team.id)

    console.log(`Added ${teamRoster.length} players to the ${team.name}`)

    const teamData = {
      _id: teamObjectId,
      id: team.id,
      name: team.name,
      abbreviation: team.abbreviation,
      officialSiteUrl: team.officialSiteUrl,
      teamName: team.teamName,
      locationName: team.locationName,
      division: team.division,
      conference: team.conference,
      roster: teamRoster
    }

    db.addTeam(teamData)
  }

  async fetchAllTeamsAndPlayers () {
    try {
      const teams = await api.getTeams()
      console.log(`${teams.length} teams received from NHL API`)
      for (const team of teams) {
        await this.fetchTeamWithRoster(team)
      }
    } catch (e) {
      console.log('Getting list of teams failed')
      console.log(e)
    }
  }

  async fetchPlayoffGamesByTeam () {
    console.log('Fetching playoff games by team')
    try {
      const data = await calc.playoffGamesByTeam()
      db.addCalculation('MostPostSeasonGames', data)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = NHLStats
