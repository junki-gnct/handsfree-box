import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import IndexTemplate from '../components/templates/IndexTemplate';

const IndexPage: React.FunctionComponent = () => {
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

  return <IndexTemplate currentUser={currentUser} />;
};

export default IndexPage;
