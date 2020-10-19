import * as firebase from 'firebase';
import * as firebaseConfig from './miscs/firebaseConfig.json';
import * as getmac from 'getmac';

import * as firebaseHandler from './firebaseHandler';

const device_id = getmac
  .default()
  .toUpperCase()
  .replace(/:/g, '')
  .replace(/-/g, '');

console.log(`Handsfree Box v${process.env.npm_package_version as string}`);
console.log('[Serial] Opening port...');

// TODO: Open serial connection.

console.log('[Serial] Port opened.');

console.log('[Firebase] Connecting to database...');
const config = {
  apiKey: firebaseConfig.api_key,
  authDomain: firebaseConfig.auth_domain,
  databaseURL: firebaseConfig.databaseURL,
};
firebase.initializeApp(config);

let gcm_token: string | null = null;

// TODO: Check user credentials.

void firebase.auth().signInWithEmailAndPassword('test@example.com', 'testtest');
firebase.auth().onAuthStateChanged((currentUser) => {
  if (currentUser) {
    console.log(`[Device] ID: ${device_id}, Registered to ${currentUser.uid}`);
    let isFirstRun = true;
    let isOpen = false;

    const db = firebase.database();
    const ref_token = db.ref(`/${currentUser.uid}/token`);
    void ref_token.on('value', (snapshot) => {
      if (snapshot.val() != null) {
        gcm_token = snapshot.val() as string;
      }
    });

    const ref = db.ref(`/${currentUser.uid}/${device_id}/`);

    void ref.on('value', (snapshot) => {
      const obj = snapshot.val() as Record<string, unknown>;
      if (obj == null) {
        void ref.set({
          isOpen: false,
          isOnline: true,
          name: 'デバイス',
        });
      } else {
        const state = obj.isOpen as boolean;

        if (isFirstRun) {
          console.log('[Firebase] Connected.');
          isFirstRun = false;
          isOpen = obj.isOpen as boolean;
        }

        firebaseHandler.checkOnlineState(obj, ref);

        if (state != isOpen) {
          isOpen = state;
          firebaseHandler.onBoxStateUpdated(state, gcm_token as string);
        }
      }
    });
  }
});
