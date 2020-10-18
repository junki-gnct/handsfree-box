// TODO: Replace Firebase Admin SDK to Firebase SDK (with Authentication.).

import * as firebase from 'firebase-admin';
import * as serviceAdminCredentials from './miscs/serviceAccountCredentials.json';
import * as getmac from 'getmac';

import * as firebaseHandler from './firebaseHandler';

const uid = 'example-uid';
const device_id = getmac
  .default()
  .toUpperCase()
  .replace(/:/g, '')
  .replace(/-/g, '');

console.log(`Handsfree Box v${process.env.npm_package_version as string}`);
console.log(`Device ID: ${device_id}, Registered to ${uid}`);
console.log('[Serial] Opening port...');

// TODO: Open serial connection.

console.log('[Serial] Port opened.');
console.log('[Firebase] Connecting to database...');
firebase.initializeApp({
  credential: firebase.credential.cert({
    clientEmail: serviceAdminCredentials.client_email,
    privateKey: serviceAdminCredentials.private_key,
    projectId: serviceAdminCredentials.project_id,
  }),
  databaseURL: 'https://handsfree-box.firebaseio.com',
});

let isFirstRun = true;
let isOpen = false;

const db = firebase.database();
const ref = db.ref(`/${uid}/${device_id}/`);

void ref.on('value', (snapshot) => {
  const obj = snapshot.val() as Record<string, unknown>;
  const state = obj.isOpen as boolean;

  if (isFirstRun) {
    console.log('[Firebase] Connected.');
    isFirstRun = false;
    isOpen = obj.isOpen as boolean;
  }
  if (obj == null) {
    void ref.set({
      isOpen: false,
      isOnline: true,
      name: 'デバイス'
    });
  } else {
    firebaseHandler.checkOnlineState(obj, ref);

    if (state != isOpen) {
      isOpen = state;
      firebaseHandler.onBoxStateUpdated(state);
    }
  }
});

/*
*     void ref.update({
      isOpen: !state
    });
*/
