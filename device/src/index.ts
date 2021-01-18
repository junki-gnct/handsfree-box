import * as firebase from 'firebase';
import * as firebaseConfig from './miscs/firebaseConfig.json';
import * as getmac from 'getmac';
import SerialPort from 'serialport';

import * as firebaseHandler from './firebaseHandler';

const device_id = getmac
  .default()
  .toUpperCase()
  .replace(/:/g, '')
  .replace(/-/g, '');

console.log(`Handsfree Box v${process.env.npm_package_version as string}`);
console.log('[Serial] Opening port...');

let onlineState = true;
let dbref: firebase.database.Reference | null = null;

const comport = 'COM4';

const port = new SerialPort(comport, {
  baudRate: 19200,
});
const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }));
parser.on('data', (data) => {
  const cmd = `${data as string}`;
  if (!cmd.startsWith('RECV')) {
    console.log('[Serial]', data);
    if (cmd.startsWith('STATE_0') || cmd.startsWith('STATE_1')) {
      onlineState = cmd.startsWith('STATE_1');
      if (dbref) {
        void dbref.update({ isOnline: onlineState });
      }
    } else if (cmd.startsWith('LOCKME')) {
      const timer = setInterval(() => {
        if (dbref) {
          void dbref.update({ isOpen: false });
          clearInterval(timer);
        }
      }, 500);
    }
  }
});

setInterval(() => {
  port.write('KeepAlive\n');
}, 1000);

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

void firebase
  .auth()
  .signInWithEmailAndPassword('test4@example.com', 'testtest');
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
    dbref = ref;

    void ref.on('value', (snapshot) => {
      const obj = snapshot.val() as Record<string, unknown>;
      if (obj == null) {
        void ref.set({
          isOpen: true,
          isOnline: true,
          name: 'デバイス',
        });
      } else {
        const state = obj.isOpen as boolean;

        if (isFirstRun) {
          console.log('[Firebase] Connected.');
          isFirstRun = false;
          isOpen = obj.isOpen as boolean;
          firebaseHandler.onBoxStateUpdated(
            state,
            gcm_token as string,
            port,
            obj.name as string,
          );
        }

        firebaseHandler.checkOnlineState(obj, ref, onlineState);

        if (state != isOpen) {
          isOpen = state;
          firebaseHandler.onBoxStateUpdated(
            state,
            gcm_token as string,
            port,
            obj.name as string,
          );
        }
      }
    });
  }
});
