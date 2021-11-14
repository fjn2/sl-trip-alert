function notifyMe(text) {
  const registration = window.swRegistration
  if(registration) {
    registration.showNotification(text)
  } else {
    alert('The registration of the SW was not found')
  }
}

export default notifyMe
