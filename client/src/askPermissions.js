function askPermission() {
  return new Promise(function(resolve, reject) {
    if (!Notification) {
      reject(new Error('Notification object is not defined'))
    }
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      console.log('We weren\'t granted permission.');
    }
  });
}

export default askPermission
