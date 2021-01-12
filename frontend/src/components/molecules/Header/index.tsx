import './header.scss';
import React from 'react';
import { HeaderLink } from './interface';
import Link from 'next/link';
import {
  Button,
  Drawer,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { Apps } from '@material-ui/icons';
import { HeaderProps } from './interface';

const Header: React.FunctionComponent<HeaderProps> = ({ drawerContents }) => {
  const [drawer, setDrawer] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawer(open);
  };

  return (
    <div className="header">
      <Button className="header__menu__button" onClick={toggleDrawer(true)}>
        <Apps className="header__menu__icon" />
      </Button>
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        <div
          className="drawer__list"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {drawerContents}
        </div>
      </Drawer>
    </div>
  );
};

export const ParseLinks = (list: HeaderLink[]): JSX.Element => (
  <>
    {list.map((item, index) => (
      <Link href={item.link} key={index}>
        <MenuItem button>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </MenuItem>
      </Link>
    ))}
  </>
);

export default Header;
