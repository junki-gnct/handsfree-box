import './login.scss';

import { useState } from 'react';
import Router from 'next/router';
import { auth } from '../../../utils/Firebase';
import { TextField, Button } from '@material-ui/core';
import LinkButton from '../../molecules/LinkButton';

const LoginForm: React.FunctionComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element>(<></>);

  const login = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setDisabled(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
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
    <div className="login">
      <h1 className="login__title">ログイン</h1>
      <form className="login__form" onSubmit={login}>
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
            ログイン
          </Button>

          <LinkButton
            href="/signup"
            variant="contained"
            color="default"
            type="button"
            disabled={disabled}
          >
            新規登録
          </LinkButton>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
