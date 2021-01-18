import React, { useEffect } from 'react';
import Router from 'next/router';
import { auth } from '../utils/Firebase';

import LoginTemplate from '../components/templates/LoginTemplate';

const LoginPage: React.FunctionComponent = () => {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && Router.push('/');
    });
  }, []);

  return <LoginTemplate />;
};

export default LoginPage;
