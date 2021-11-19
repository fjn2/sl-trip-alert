const NOTIFICATION_MESSAGE = 'It is time to leave, you have to take the SL!'

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('Service worker install')
});

self.addEventListener('notificationclick', function(event) {
  const rootUrl = new URL('/', location).href;
    event.notification.close();
    // Enumerate windows, and call window.focus(), or open a new one.
    event.waitUntil(
      clients.matchAll().then(matchedClients => {
        for (let client of matchedClients) {
          if (client.url === rootUrl) {
            return client.focus();
          }
        }
        return clients.openWindow("/");
      })
    );
});

self.addEventListener('push', function(event) {
  console.log('push event recived', event)
  let message = NOTIFICATION_MESSAGE
  if(event.data) {
    message = event.data.text();
  }

  if (self.registration.showNotification) {
    const options = {
      body: message,
      icon: '/sl-icon.png',
    }
    self.registration.showNotification('New Message!', options);
  } else {
    console.log('showNotification is not defined')
  }
})
