import { useEffect, useState } from 'react';
import { User } from '@firebase/auth-types';

import { database } from '../../../utils/Firebase';
import UserHeader from '../../organisms/UserHeader';
import LogList from '../../organisms/LogList';
import dynamic from 'next/dynamic';
import { LogData } from '../../organisms/LogList/interface';

const LogTemplate: React.FunctionComponent<{
  currentUser: User | null;
}> = ({ currentUser }) => {
  const [logs, setLogs] = useState<LogData[]>([]);

  useEffect(() => {
    initDatabase();
  }, [currentUser]);

  const initDatabase = (): void => {
    if (currentUser !== null) {
      const ref = database.ref(`/${currentUser.uid}`);
      ref.on('value', (snapshot) => {
        const l = snapshot.val()['logs'] as string;
        let log: LogData[] = [];
        if (l != null) {
          log = JSON.parse(l);
          log.sort((a, b) => {
            const date_a = new Date(a.date);
            const date_b = new Date(b.date);
            if (date_a < date_b) return 1;
            else if (date_b < date_a) return -1;
            else return 0;
          });
        }
        setLogs(log);
      });
    }
  };

  const PushNotificationHandler = dynamic(
    () => import('../../organisms/PushNotificationHandler'),
    {
      ssr: false,
    },
  );

  return (
    <>
      <PushNotificationHandler />
      <UserHeader />
      <LogList user={currentUser} logs={logs} />
    </>
  );
};

export default LogTemplate;
