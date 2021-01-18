/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js',
);

firebase.initializeApp({
  messagingSenderId: '441504308723',
  projectId: 'handsfree-box',
  apiKey: 'AIzaSyBDvnFMHjLLuOM8Zkl1nTAXTY-xhmKiIYU',
  appId: '1:441504308723:web:f18579e0d49696071b0686',
});

const messaging = firebase.messaging();
