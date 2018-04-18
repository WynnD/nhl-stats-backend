const db = require('./DbWrapper')
const api = require('./ApiWrapper')

class Calculations {
  async mostPostSeasonGamesByTeam () {
    let responseList = []
    const teams = await db.getAllTeams()
    for (const team of teams) {
      const teamData = await this.calcPostGameSum(team)
      responseList.push(teamData)
    }
    responseList.sort((a, b) => { return b.gamesSum - a.gamesSum })
    return responseList
  }

  async calcPostGameSum (team) {
    let gamesSum = 0
    const roster = await db.getPlayersByTeamId(team._id)
    for (const player of roster) {
      const stats = await api.getCareerPostSeasonStats(player.person.id)
      if (stats !== false && stats.games !== undefined) {
        const games = stats.games
        gamesSum += games
      }
    }
    const teamData = {
      teamId: team._id,
      name: team.name,
      gamesSum
    }
    return teamData
  }
}

module.exports = new Calculations()
