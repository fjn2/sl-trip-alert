import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import urlBase64ToUint8Array from './urlBase64ToUint8Array'
import sendSubscriptionToBackend from './sendSubscriptionToBackend'
// import './firebase'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


if (!('serviceWorker' in navigator)) {
  alert('Service Worker isn\'t supported on this browser, disable or hide UI.')
}

if (!('PushManager' in window)) {
  alert('Push isn\'t supported on this browser, disable or hide UI.')
}
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // @ts-ignore
      window.swRegistration = registration

      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
      } else if (registration.active) {
        serviceWorker = registration.active;
      }

      // @ts-ignore
      serviceWorker.addEventListener('statechange', function(e) {
        console.log('statechange', e)
      })

      setTimeout(() => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BPQ31iS_wnpweqM4eAu2BtoYuphbyNXA8here-MlI5RiFCdAt9E6gVhaCtngo_zuAP-xBB2T0C5dO5iBTpbNCbc' // PUBLIC KEY
          )
        }).then(function(pushSubscription) {
          console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
          // Send subscription to server
          sendSubscriptionToBackend(pushSubscription)
          return pushSubscription;
        });
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ' + registration.scope);
      }, 3000)
    }, function(err) {
      // registration failed :(
      alert('ServiceWorker registration failed: ' + err.message);
    });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
