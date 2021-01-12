import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { auth } from '../utils/Firebase';

import Header from '../components/Header';

const LoginPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && Router.push('/');
    });
  }, []);

  const login = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      Router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        <form className="auth" onSubmit={login}>
          <div>
            <label htmlFor="email" className="auth-label">
              Email:{' '}
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="password" className="auth-label">
              Password:{' '}
            </label>
            <input
              id="password"
              className="auth-input"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>
        <Link href="/signup">
          <a className="auth-link">signup</a>
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
