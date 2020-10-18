import * as firebase from 'firebase-admin';
import * as serviceAdminCredentials from './miscs/serviceAccountCredentials.json';

console.log(`Handsfree Box v${(process.env.npm_package_version as string)}`);
console.log('[Firebase] Connecting to database...');
firebase.initializeApp({
  credential: firebase.credential.cert({
    clientEmail: serviceAdminCredentials.client_email,
    privateKey: serviceAdminCredentials.private_key,
    projectId: serviceAdminCredentials.project_id,
  }),
  databaseURL: 'https://handsfree-box.firebaseio.com',
});

let isFirstRun = false;
const db = firebase.database();
const ref = db.ref('/');

void ref.on('value', (snapshot) => {
  if(!isFirstRun) {
    console.log('[Firebase] Connected.');
    isFirstRun = true;
  }
  const state = snapshot.child('isOpen').val() as boolean;
  console.log(state);
});
