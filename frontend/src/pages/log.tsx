import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import LogTemplate from '../components/templates/LogTemplate';

const LogPage: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        Router.push('/login');
      }
    });
  }, []);

  return <LogTemplate currentUser={currentUser} />;
};

export default LogPage;
