const mongoose = require('mongoose')
const app = require('express')
const db = require('./DbWrapper')
const api = require('./ApiWrapper')
const calc = require('./Calculations')

const fetchRoster = async function (teamObjectId, teamApiId) {
  const roster = await api.getRoster(teamApiId)

  let playerIds = []
  for (const player of roster) {
    player._id = new mongoose.Types.ObjectId()
    player.teamId = teamObjectId
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
  db.connect(() => {
    mongoose.connection.db.dropDatabase()
    fetchAllTeamsAndPlayers().then(() => {
      calc.teamMostPostSeasonGames()
    })
    // api.getCareerPostSeasonStats(8471675);
    // calc.teamMostPostSeasonGames();
  })
} catch (e) {
  console.error(e)
}
