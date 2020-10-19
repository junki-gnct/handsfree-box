importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyBDvnFMHjLLuOM8Zkl1nTAXTY-xhmKiIYU',
  authDomain: 'handsfree-box.firebaseapp.com',
  databaseURL: 'https://handsfree-box.firebaseio.com',
  projectId: 'handsfree-box',
  storageBucket: 'handsfree-box.appspot.com',
  messagingSenderId: '441504308723',
  appId: '1:441504308723:web:f18579e0d49696071b0686',
  measurementId: 'G-K3C97TTE37',
});

const messaging = firebase.messaging();
