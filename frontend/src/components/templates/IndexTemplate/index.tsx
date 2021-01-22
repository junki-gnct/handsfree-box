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

  const devices_equal = (a: Device[], b: Device[]): boolean => {
    if (!Array.isArray(a)) return false;
    if (!Array.isArray(b)) return false;
    if (a.length != b.length) return false;
    for (let i = 0, n = a.length; i < n; ++i) {
      if (
        a[i].id !== b[i].id ||
        a[i].name !== b[i].name ||
        a[i].isOpen !== b[i].isOpen ||
        a[i].isOnline !== b[i].isOnline
      )
        return false;
    }
    return true;
  };

  const initDatabase = (): void => {
    if (currentUser !== null) {
      const ref = database.ref(`/${currentUser.uid}`);
      ref.on('value', async (snapshot) => {
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
        let nowState: Device[] = [];
        setDevices((state) => {
          nowState = state;
          return state;
        });
        if (!devices_equal(nowState, devicelist)) {
          setDevices(devicelist);
        }
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
