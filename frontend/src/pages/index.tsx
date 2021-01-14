import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth, database } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import UserHeader from '../components/organisms/UserHeader';

const IndexPage: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [
    dataRef,
    setDataRef,
  ] = useState<firebase.default.database.Reference | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : Router.push('/login');
    });
  }, []);

  useEffect(() => {
    initDatabase();
  }, [currentUser]);

  const initDatabase = (): void => {
    if (currentUser !== null) {
      const ref = database.ref(`/${currentUser.uid}`);
      setDataRef(ref);
      ref.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      Router.push('/');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <UserHeader />
      <pre>{JSON.stringify(currentUser, null, 4)}</pre>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default IndexPage;
