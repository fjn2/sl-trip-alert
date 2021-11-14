const getServiceWorkerRegistration = () => {
  // register service worker for the notifications
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    return registrations[0] // return the first registration
  }).catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
}

const showNotificationWithServiceWorker = (text) => {
  const registration = getServiceWorkerRegistration()
  if(registration) {
    registration.showNotification(text)
  } else {
    alert('The registration of the SW was not found')
  }
}

function notifyMe(text) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    if (window.matchMedia('(display-mode: standalone)').matches) {
      showNotificationWithServiceWorker(text)
    } else {
      var notification = new Notification(text);
    }
  }

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          showNotificationWithServiceWorker(text)
        } else {
          var notification = new Notification(text);
        }
      }
    });
  } else {
    alert(`Permission is ${Notification.permission}`);
  }
}

export default notifyMe
