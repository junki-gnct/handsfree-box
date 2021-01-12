import { useEffect, useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { auth } from '../utils/Firebase';

const SignUpPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && Router.push('/');
    });
  }, []);

  const createUser = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      Router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="wrapper">
      <form className="auth" onSubmit={createUser}>
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
          SignUp
        </button>
      </form>
      <Link href="/login">
        <a className="auth-link">Login</a>
      </Link>
    </div>
  );
};

export default SignUpPage;
