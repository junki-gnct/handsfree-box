import * as firebase from 'firebase-admin';
import * as serviceAdminCredentials from './miscs/serviceAccountCredentials.json';

firebase.initializeApp({
  credential: firebase.credential.cert({
    clientEmail: serviceAdminCredentials.client_email,
    privateKey: serviceAdminCredentials.private_key,
    projectId: serviceAdminCredentials.project_id
  }),
  databaseURL: 'https://handsfree-box.firebaseio.com'
});

function hello(name: string): string {
  return `Hello, ${name}!`;
}

console.log(serviceAdminCredentials.type);
console.log(hello('TypeScript!!!!!'));
