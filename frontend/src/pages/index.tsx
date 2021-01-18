import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth, database } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import UserHeader from '../components/organisms/UserHeader';
import DeviceList from '../components/organisms/DeviceList';
import { Device } from '../components/organisms/DeviceList/interface';

import dynamic from 'next/dynamic';

const IndexPage: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        Router.push('/login');
      }
    });
  }, []);

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
    () => import('../components/organisms/PushNotificationHandler'),
    {
      ssr: false,
    },
  );

  return (
    <div>
      <PushNotificationHandler />
      <UserHeader />
      <DeviceList user={currentUser ? currentUser : null} devices={devices} />
    </div>
  );
};

export default IndexPage;
