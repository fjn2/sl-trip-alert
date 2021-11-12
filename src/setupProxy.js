const { createProxyMiddleware } = require('http-proxy-middleware');

const HOST = 'https://webcloud.sl.se'

module.exports = function(app) {
  app.use(
    '/api/sl', (req, res) => {
      var fetchUrl = require("fetch").fetchUrl;
      const originSiteId = req.query.originSiteId || 9248   // default id is AGA
      fetchUrl(`${HOST}/api/v2/departures?mode=departures&origSiteId=${originSiteId}&desiredResults=3`, function(error, meta, body){
          console.log(body.toString());
          res.send(body.toString())
      });
    }
  );
};