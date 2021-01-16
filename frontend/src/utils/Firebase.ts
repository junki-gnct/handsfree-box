// https://zenn.dev/k_logic24/articles/react-auth-with-firebase

import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging';
import localforage from 'localforage';

import firebase from 'firebase/app';

const config = {
  apiKey: process.env.FIREBASE_KEY,
  //appId: process.env.FIREBASE_APP_ID,
  appId: '1:441504308723:web:f18579e0d49696071b0686', // TODO: replace this.
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
};

// initializeを複数回走らせない
if (firebase.apps.length === 0) {
  console.log(config);
  firebase.initializeApp(config);
}

const firebaseCloudMessaging = {
  tokenInlocalforage: async function (): Promise<string | null> {
    return localforage.getItem('fcm_token');
  },
  init: async function (): Promise<string | null | undefined> {
    if (firebase.apps.length === 0) {
      console.log(config);
      firebase.initializeApp(config);
    }

    try {
      if (self) {
        const messaging = firebase.messaging();
        const tokenInLocalForage = await this.tokenInlocalforage();
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }

        const status = await Notification.requestPermission();
        if (status && status === 'granted') {
          const fcm_token = await messaging.getToken();
          if (fcm_token) {
            localforage.setItem('fcm_token', fcm_token);
            console.log('fcm token', fcm_token);

            return fcm_token;
          }
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

const auth = firebase.auth();
const database = firebase.database();
export { auth, database, firebaseCloudMessaging };
