import { HeaderLink } from '../../molecules/Header/interface';
import Header, { ParseLinks } from '../../molecules/Header';

import { LockOpen, ExitToApp } from '@material-ui/icons';

const GuestHeader: React.FunctionComponent = () => {
  const guestLinks: HeaderLink[] = [
    {
      label: 'ログイン',
      link: '/login',
      icon: <LockOpen />,
    },
    {
      label: '新規登録',
      link: '/signup',
      icon: <ExitToApp />,
    },
  ];

  return <Header drawerContents={[ParseLinks(guestLinks)]} />;
};

export default GuestHeader;
