// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ5pm5YTlWRL8XIOm8PlyIMbPowpZAL1c",
  authDomain: "sl-time-schedule.firebaseapp.com",
  projectId: "sl-time-schedule",
  storageBucket: "sl-time-schedule.appspot.com",
  messagingSenderId: "284383653866",
  appId: "1:284383653866:web:e6b9c58cefd6a9f8540c93",
  measurementId: "G-70Z03EGX5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// getToken({vapidKey: "BNmc3QRz8Jkt-L0fY-pfWEJctW9Grr6cJti0rQ88NxyxJFSpXAVQub5i2E5180B_q7tJm0fzI9Ls5uDdFOQs-50"}).then((currentToken) => {
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


onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});