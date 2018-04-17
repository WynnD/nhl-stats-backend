const mongoose = require('mongoose');
const app = require('express');
const config = require('config');
const axios = require('axios');
const Team = require('./model.js');

const dbConfig = config.get("dbConfig");
const apiUrl = config.get("apiUrl");

try {
  if (dbConfig.user) {
    mongoose.connect(`mongodb+srv://${dbConfig.user.username}:${dbConfig.user.password}@${dbConfig.host}/${dbConfig.dbName}`);
  } else {
    mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}`);
  }

  Team.collection.drop();
} catch (e) {
  console.error(e);
}


const getTeamRoster = async function(id) {
  const response = await axios.get(`${apiUrl}/teams/${id}/roster`);
  const roster = response.data.roster;
  console.log(roster);
  return roster;
}

const handleTeam = async function (team) {
  const teamRoster = await getTeamRoster(team.id);
  const teamData = {
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
  const newTeam = new Team(teamData);
  newTeam.save((err, team) => {
    if (err) console.log(err);
    else console.log(team); 
  });
}

const handleTeamsResponse = async function(response) {
  const teams = response.data.teams;
  for (const team of teams) {
    await handleTeam(team);
  }
  console.log("Done processing teams");
}


axios.get(`${apiUrl}/teams`)
  .then(handleTeamsResponse)
  .catch((e) => {
    console.log('Getting list of teams failed');
    console.log(e);
  });