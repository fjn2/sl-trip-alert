require('dotenv').config()
require('dotenv').config()
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser')

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

  app.get('/send', (req, res) => {
    console.log('get /send', req.query)
    const webpush = require('web-push');

    if (!req.query.id) {
      res.status(400);
      res.send({
        error: {
          id: 'no-id-provided',
          message: 'The id is missing in the query params'
        }
      })
      return
    }
    const item = db[req.query.id]
    if (!item) {
      res.status(400);
      res.send({
        error: {
          id: 'no-found-provided',
          message: 'The id was not found in the DB'
        }
      })
      return
    }

    // VAPID keys should be generated only once.
    // const vapidKeys = webpush.generateVAPIDKeys();

    webpush.setGCMAPIKey(process.env.GCM_API_KEY);
    webpush.setVapidDetails(
      'mailto:' + process.env.CONTACT_EMAIL,
      process.env.VAPID_APP_SERVER_KEY_PUBLIC,
      process.env.VAPID_APP_SERVER_KEY_PRIVATE
    );

    // This is the same output of calling JSON.stringify on a PushSubscription
    const pushSubscription = item
    webpush.sendNotification(pushSubscription, '');

    res.send('Sending the response to ' + Object.keys(db).length + ' clients')
  })

  const db = {}
  let dbId = 0

  const isValidSaveRequest = (req, res) => {
    // TODO implement this validation
    return true
  }
  const saveSubscriptionToDatabase = (data) => {
    dbId ++;
    db[dbId] = data
    console.log('New record', dbId)
    return Promise.resolve(dbId)
  }
  const getByEndpointName = (endpoint) => {
    return Object.keys(db).find((key) => {
      const item = db[key]
      return item.endpoint === endpoint
    })
  }
  app.use('/api/save-subscription/', bodyParser.json())
  app.post('/api/save-subscription/', function (req, res) {
    if (!isValidSaveRequest(req, res)) {
      return;
    }
    const item = getByEndpointName(req.body.endpoint)
    if (item) {
      // TODO check for expiration date
      res.send(JSON.stringify({
        data: {
          success: true,
          message: 'The client was already stored'
        }
      }));
    }
    return saveSubscriptionToDatabase(req.body)
    .then(function(subscriptionId) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: { success: true, id: subscriptionId } }));
    })
    .catch(function(err) {
      console.log('Error: ', err.message)
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: {
          id: 'unable-to-save-subscription',
          message: 'The subscription was received but we were unable to save it to our database.'
        }
      }));
    });
  });
};
