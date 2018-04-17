const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const TeamSchema = new Schema({
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
  conference : {
    id: Number,
    name: String,
    link: String
  },
  roster: [{ 
    person: Mixed,
    jerseyNumber: Number,
    position: Mixed
  }]
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;