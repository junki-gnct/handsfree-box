import firebase from 'firebase';

export function isLoggedIn(): boolean {
  const jwt = localStorage.getItem('jwt');
  if (jwt == null || jwt == '') return false;

  const payload = Buffer.from(jwt.split('.')[1], 'base64');
  const obj = JSON.parse(payload.toString('ascii'));

  if (obj.exp < Math.floor(new Date().getTime() / 1000)) {
    localStorage.removeItem('jwt');
    return false;
  }

  return true;
}

export function logout(): void {
  firebase.auth().signOut();
  localStorage.removeItem('jwt');
}
