const app = require('express')()
const db = require('./DbWrapper')

class RequestHandler {
  constructor (port = process.env.PORT || 3000) {
    app.listen(port)
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
    console.log('listening on port', port)
    this.openTeamPostSeasonGamesEndpoint()
  }

  openTeamPostSeasonGamesEndpoint () {
    app.get('/api/stats/team/postseason/games', async (req, res) => {
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
  }
}

module.exports = RequestHandler
