/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

if (!firebase.apps.length) {
  var config = {
    messagingSenderId: '441504308723',
    projectId: 'handsfree-box',
    apiKey: 'AIzaSyBDvnFMHjLLuOM8Zkl1nTAXTY-xhmKiIYU',
    appId: '1:441504308723:web:f18579e0d49696071b0686',
  };
  firebase.initializeApp(config);
}

firebase.messaging();

firebase
  .messaging()
  .setBackgroundMessageHandler((payload) => console.log('payload', payload));
