const axios = require('axios')
const config = require('config')
const apiUrl = config.get('apiUrl')

class ApiWrapper {
  async getRoster (teamApiId) {
    const response = await axios.get(`${apiUrl}/teams/${teamApiId}/roster`)
    return response.data.roster
  }

  async getTeams () {
    const apiResponse = await axios.get(`${apiUrl}/teams`)
    return apiResponse.data.teams
  }

  async getCareerPostSeasonStats (playerId) {
    try {
      const apiResponse = await axios.get(`${apiUrl}/people/${playerId}/stats?stats=careerPlayoffs`)
      const stats = apiResponse.data.stats[0].splits[0].stat
      return stats
    } catch (e) {
      console.log('Player does not have postseason stats')
      return false
    }
  }
}

module.exports = new ApiWrapper()
