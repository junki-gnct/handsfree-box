import firebase from 'firebase/app';
import 'firebase/messaging';
import { auth, database } from '../../../utils/Firebase';

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
  firebase.initializeApp(config);
}

const vapid =
  'BMH9LyfveMmuiyBYdC3H8JLo39uwQuYGyh8l1gQFcnmvqnIiGaTWSJymNbquBjhQCNVJA3P8a-M_CkarfOvl34A';

const messaging = firebase.messaging();
Notification.requestPermission().then(() => {
  messaging.getToken({ vapidKey: vapid }).then((token) => {
    auth.onAuthStateChanged((user) => {
      if (user && token) {
        database.ref(`/${user.uid}`).update({
          token: token,
        });
      }
    });
  });
});

messaging.onMessage((payload) => {
  console.log('[Message]', payload);
});

const PushNotificationHandler: React.FunctionComponent = () => {
  return <></>;
};

export default PushNotificationHandler;
