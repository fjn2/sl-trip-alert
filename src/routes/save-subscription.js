const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser')

const isValidSaveRequest = (req, res) => {
  // TODO implement this validation
  return true
}

module.exports = (app) => {
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
          message: 'The client was already stored',
          id: item.id
        }
      }));
      return
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
}
