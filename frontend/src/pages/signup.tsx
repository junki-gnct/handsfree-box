import React, { useEffect } from 'react';
import Router from 'next/router';
import { auth } from '../utils/Firebase';

import SignupTemplate from '../components/templates/SignupTemplate';

const SignUpPage: React.FunctionComponent = () => {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && Router.push('/');
    });
  }, []);

  return <SignupTemplate />;
};

export default SignUpPage;
