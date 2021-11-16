const NOTIFICATION_MESSAGE = 'It is time to leave, you have to take the SL!'

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('Service worker console log')
});

self.addEventListener('push', function(event) {
  console.log('push event recived', event)
  self.registration.showNotification(NOTIFICATION_MESSAGE);
})




// const messaging = getMessaging();
// messaging.getToken({vapidKey: "BNmc3QRz8Jkt-L0fY-pfWEJctW9Grr6cJti0rQ88NxyxJFSpXAVQub5i2E5180B_q7tJm0fzI9Ls5uDdFOQs-50"}).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });


// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });



// https://fcm.googleapis.com//v1/projects/sl-time-schedule/messages:send
// Content-Type: application/json
// Authorization: bearer BNmc3QRz8Jkt-L0fY-pfWEJctW9Grr6cJti0rQ88NxyxJFSpXAVQub5i2E5180B_q7tJm0fzI9Ls5uDdFOQs-50

// {
//   "message": {
//     "token": "BNmc3QRz8Jkt-L0fY-pfWEJctW9Grr6cJti0rQ88NxyxJFSpXAVQub5i2E5180B_q7tJm0fzI9Ls5uDdFOQs-50",
//     "notification": {
//       "title": "Background Message Title",
//       "body": "Background message body"
//     },
//     "webpush": {
//       "fcm_options": {
//         "link": "https://dummypage.com"
//       }
//     }
//   }
// }