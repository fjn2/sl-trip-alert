module.exports = (app) => {
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
    webpush.sendNotification(pushSubscription, req.query.message);

    res.send('Sending the response to ' + Object.keys(db).length + ' clients')
  })
}
