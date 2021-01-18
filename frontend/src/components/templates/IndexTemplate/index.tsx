import { useEffect, useState } from 'react';
import { User } from '@firebase/auth-types';

import { database } from '../../../utils/Firebase';
import UserHeader from '../../organisms/UserHeader';
import DeviceList from '../../organisms/DeviceList';
import dynamic from 'next/dynamic';
import { Device } from '../../organisms/DeviceList/interface';

const IndexTemplate: React.FunctionComponent<{
  currentUser: User | null;
}> = ({ currentUser }) => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    initDatabase();
  }, [currentUser]);

  const initDatabase = (): void => {
    if (currentUser !== null) {
      const ref = database.ref(`/${currentUser.uid}`);
      ref.on('value', (snapshot) => {
        const devicelist: Device[] = [];
        Object.keys(snapshot.val()).forEach((key) => {
          const data = snapshot.val()[key];
          if (data.name && key != 'token') {
            const device: Device = {
              id: key,
              isOnline: data.isOnline,
              isOpen: data.isOpen,
              name: data.name,
            };
            devicelist.push(device);
          }
        });
        setDevices(devicelist);
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
      <DeviceList user={currentUser ? currentUser : null} devices={devices} />
    </>
  );
};

export default IndexTemplate;
