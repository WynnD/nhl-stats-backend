const mongoose = require('mongoose')
const app = require('express')()
const db = require('./DbWrapper')
const api = require('./ApiWrapper')
const calc = require('./Calculations')

app.get('/api/stats/team/postSeasonGames', async (req, res) => {
  console.log('received request for team postseason games')
  try {
    const data = await db.getMostRecentTeamCalculation('MostPostSeasonGames')
    console.log('sending data')
    res.status(200).send(data.datapoints)
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
})

const fetchRoster = async function (teamObjectId, teamApiId) {
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

const fetchTeamWithRoster = async function (team) {
  const teamObjectId = new mongoose.Types.ObjectId()
  const teamRoster = await fetchRoster(teamObjectId, team.id)

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

const fetchAllTeamsAndPlayers = async function () {
  try {
    const teams = await api.getTeams()
    console.log(`${teams.length} teams received from NHL API`)
    for (const team of teams) {
      await fetchTeamWithRoster(team)
    }
  } catch (e) {
    console.log('Getting list of teams failed')
    console.log(e)
  }
}

try {
  db.connect(async () => {
    if (process.argv[2] === '-w') {
      mongoose.connection.db.dropDatabase()
      await fetchAllTeamsAndPlayers()
      await fetchPlayoffGamesByTeam()
    }
    app.listen(process.env.PORT || 3000)
    console.log('listening on port', process.env.PORT || 3000)
  })
} catch (e) {
  console.error(e)
}

const fetchPlayoffGamesByTeam = async function () {
  try {
    const data = await calc.playoffGamesByTeam()
    db.addCalculation('MostPostSeasonGames', data)
  } catch (e) {
    console.error(e)
  }
}
