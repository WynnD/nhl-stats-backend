const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const teamSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: Number,
  name: String,
  link: String,
  abbreviation: String,
  officialSiteUrl: String,
  teamName: String,
  locationName: String,
  division: {
    id: Number,
    name: String,
    link: String
  },
  conference: {
    id: Number,
    name: String,
    link: String
  },
  roster: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
})

const personSchema = new Schema({
  id: Number,
  fullName: String,
  link: String
})

const positionSchema = new Schema({
  code: String,
  name: String,
  type: String,
  abbreviation: String
})

const playerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  teamId: {type: Schema.Types.ObjectId, ref: 'Team'},
  person: personSchema,
  jerseyNumber: Number,
  position: positionSchema
})

const Team = mongoose.model('Team', teamSchema)
const Player = mongoose.model('Player', playerSchema)

module.exports = { Team, Player }
