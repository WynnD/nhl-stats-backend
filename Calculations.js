const db = require('./DbWrapper')
const api = require('./ApiWrapper')

class Calculations {
  async teamMostPostSeasonGames () {
    let responseList = []
    const teams = await db.getAllTeams()
    for (const team of teams) {
      let gamesSum = 0
      const roster = await db.getPlayersByTeamId(team._id)
      for (const player of roster) {
        const stats = await api.getCareerPostSeasonStats(player.person.id)
        if (stats !== false && stats.games !== undefined) {
          const games = stats.games
          gamesSum += games
        }
      }

      console.log(`${team.name} - ${gamesSum}`)
      let teamData = team
      teamData.numGames = gamesSum
      // TODO: numGames datapoint isn't being added to teamData
      responseList.push(teamData)
    }

    responseList = responseList.sort((a, b) => { return b.gamesSum - a.gamesSum })
    console.log(responseList)

    return responseList
  }
}

module.exports = new Calculations()
