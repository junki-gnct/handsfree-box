import './signup.scss';

import { useState } from 'react';
import LinkButton from '../../molecules/LinkButton';
import { TextField, Button } from '@material-ui/core';
import Router from 'next/router';
import { auth } from '../../../utils/Firebase';

const SignupForm: React.FunctionComponent = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element>(<></>);

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
    <div className="signup">
      <h1 className="signup__title">新規登録</h1>
      <form className="signup__form" onSubmit={createUser}>
        <TextField
          id="standard-basic"
          label="名前"
          type="name"
          className="signup__form__input"
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          id="standard-basic"
          label="メールアドレス"
          type="email"
          className="signup__form__input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="standard-basic"
          label="パスワード"
          type="password"
          className="signup__form__input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="signup__form__error">{message}</p>

        <div className="signup__form__buttons">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={disabled}
          >
            新規登録
          </Button>

          <LinkButton
            href="/login"
            variant="contained"
            color="default"
            type="button"
            disabled={disabled}
          >
            ログイン
          </LinkButton>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
