const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(
    '/api/sl', (req, res) => {
      var fetchUrl = require("fetch").fetchUrl;
      // source file is iso-8859-15 but it is converted to utf-8 automatically
      fetchUrl("https://webcloud.sl.se/api/v2/departures?mode=departures&origPlaceId=QT0xQE89QWdhIChMaWRpbmfDtilAWD0xODE1NDU3OUBZPTU5MzQ2ODY1QFU9NzRATD0zMDAxMDkyNDhAQj0xQHA9MTYzNTk5MTIxMUA%3D&origSiteId=9248&desiredResults=3&origName=Aga+%28Liding%C3%B6%29", function(error, meta, body){
          console.log(body.toString());
          res.send(body.toString())
      });
    }
  );
};