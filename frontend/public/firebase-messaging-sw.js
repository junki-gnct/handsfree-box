/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

if (!firebase.apps.length) {
  firebase.initializeApp({
    messagingSenderId: '441504308723',
  });
}

firebase.messaging();

firebase
  .messaging()
  .setBackgroundMessageHandler((payload) => console.log('payload', payload));
