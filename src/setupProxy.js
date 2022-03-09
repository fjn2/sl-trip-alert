require('dotenv').config()
const sl = require('./routes/sl')
const saveSubscriptions = require('./routes/save-subscription')
const send = require('./routes/send')

const HOST = 'https://webcloud.sl.se'

module.exports = function(app) {
  app.use(
    '/api/sl', (req, res) => {
      var fetchUrl = require("fetch").fetchUrl;
      const originSiteId = req.query.originSiteId || 9248   // default id is AGA
      fetchUrl(`${HOST}/api/v2/departures?mode=departures&origSiteId=${originSiteId}&desiredResults=3`, function(error, meta, body){
          res.send(body.toString())
      });
    }
  );

  send(app)

  saveSubscriptions(app)
};
