import React from 'react';
import Router from 'next/router';

import { auth } from '../../../utils/Firebase';

import { HeaderLink } from '../../molecules/Header/interface';

import ConfirmDialog from '../../molecules/ConfirmDialog';

import { Home, ListAlt } from '@material-ui/icons';
import Header, { ParseLinks } from '../../molecules/Header';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Lock } from '@material-ui/icons';

const UserHeader: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  auth.onAuthStateChanged((user) => {
    user && setUserName(user?.displayName ? user?.displayName : 'NULL');
  });

  const logout = async (): Promise<void> => {
    setOpen(false);
    await auth.signOut();
    Router.push('/login');
  };

  const userLinks: HeaderLink[] = [
    {
      label: 'ホーム',
      link: '/',
      icon: <Home />,
    },
    {
      label: 'ログ',
      link: '/log',
      icon: <ListAlt />,
    },
  ];

  return (
    <>
      <ConfirmDialog
        title="ログアウトしますか？"
        state={open}
        cancel_handler={() => setOpen(false)}
        cancel_text="いいえ"
        positive_handler={logout}
        positive_text="はい"
      />
      <Header
        drawerContents={[
          <List key="username">
            <ListItem>ようこそ, {userName}さん</ListItem>
          </List>,
          <Divider key="div1" />,
          ParseLinks(userLinks),
          <Divider key="div2" />,
          <List key="logout">
            <ListItem button onClick={() => setOpen(true)}>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
          </List>,
        ]}
      />
    </>
  );
};

/*

*/

export default UserHeader;
