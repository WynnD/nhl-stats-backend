const mongoose = require('mongoose');
const app = require('express');
const config = require('config');
const axios = require('axios');
const model = require('./model.js');

const dbConfig = config.get("dbConfig");
const apiUrl = config.get("apiUrl");

const getTeamRoster = async function (teamObjectId, teamApiId) {
  const response = await axios.get(`${apiUrl}/teams/${teamApiId}/roster`);
  const roster = response.data.roster;
  let playerIds = [];
  for (const player of roster) {
    let playerData = player;
    playerData._id = new mongoose.Types.ObjectId();
    playerData.teamId = teamObjectId;
    playerIds.push(playerData._id);
    const newPlayer = new model.Player(playerData);
    newPlayer.save((err, player) => {
      if (err) console.log(err);
      else {
        // console.info('added player:', player);
      }
    });
  }
  return playerIds;
}

const handleTeam = async function (team) {
  const teamObjectId = new mongoose.Types.ObjectId();
  const teamRoster = await getTeamRoster(teamObjectId, team.id);
  console.log(`added ${teamRoster.length} players to the ${team.name}`);
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

  const newTeam = new model.Team(teamData);
  newTeam.save((err, team) => {
    if (err) console.log(err);
    else console.log(`Added team ${team.name}`); 
  });
}

const handleTeamsResponse = async function(response) {
  const teams = response.data.teams;
  console.log(`${teams.length} teams found`);
  for (const team of teams) {
    await handleTeam(team);
  }
  return;
}

const getAllTeamsWithRosters = async function() {
  try {
    const apiResponse = await axios.get(`${apiUrl}/teams`)
    await handleTeamsResponse(apiResponse);
  } catch (e) {
    console.log('Getting list of teams failed');
    console.log(e);
  }
}

try {
  if (dbConfig.user)
    mongoose.connect(
      `mongodb+srv://${dbConfig.user.username}:${dbConfig.user.password}@${dbConfig.host}/${dbConfig.dbName}`,
      () => {
        mongoose.connection.db.dropDatabase();
        getAllTeamsWithRosters();
      });
  else
    mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`,
      () => {
        mongoose.connection.db.dropDatabase();
        getAllTeamsWithRosters();
      });
} catch (e) {
  console.error(e);
}
