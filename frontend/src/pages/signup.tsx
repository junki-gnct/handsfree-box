import './login.scss';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { auth } from '../utils/Firebase';

import GuestHeader from '../components/organisms/GuestHeader';
import { TextField, Button } from '@material-ui/core';

const SignUpPage: React.FunctionComponent = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element>(<></>);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && Router.push('/');
    });
  }, []);

  const createUser = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setDisabled(true);
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      await user.user?.updateProfile({
        displayName: name,
      });
      Router.push('/');
    } catch (err) {
      setMessage(
        <>
          {'エラーが発生しました。'}
          <br />
          {err.message}
        </>,
      );
    }
    setDisabled(false);
  };

  return (
    <>
      <GuestHeader />
      <div className="login">
        <h1 className="login__title">新規登録</h1>
        <form className="login__form" onSubmit={createUser}>
          <TextField
            id="standard-basic"
            label="名前"
            type="name"
            className="login__form__input"
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            id="standard-basic"
            label="メールアドレス"
            type="email"
            className="login__form__input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="standard-basic"
            label="パスワード"
            type="password"
            className="login__form__input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="login__form__error">{message}</p>

          <div className="login__form__buttons">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={disabled}
            >
              新規登録
            </Button>

            <Link href="/login">
              <Button
                variant="contained"
                color="default"
                type="button"
                disabled={disabled}
              >
                ログイン
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
