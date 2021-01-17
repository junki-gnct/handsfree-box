import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth, database } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import UserHeader from '../components/organisms/UserHeader';
import DeviceList from '../components/organisms/DeviceList';
import { Device } from '../components/organisms/DeviceList/interface';

import 'firebase/messaging';
import firebase from 'firebase/app';

import { firebaseCloudMessaging } from '../utils/Firebase';

const IndexPage: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setToken(user);
      } else {
        Router.push('/login');
      }
    });

    const tokenHandler = (token: string): void => {
      console.log('fcm token', 'token refreshed.');
      if (currentUser && token)
        database.ref(`/${currentUser.uid}`).update({ token: token });
    };

    const setToken = async (user: User): Promise<void> => {
      try {
        const token = await firebaseCloudMessaging.init(tokenHandler);
        console.log(token);
        console.log(user);
        if (user && token)
          database.ref(`/${user.uid}`).update({ token: token });
        if (token) {
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getMessage = (): void => {
      const messaging = firebase.messaging();
      messaging.onMessage((message) => console.log('foreground ', message));
    };
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

  return (
    <div>
      <UserHeader />
      <DeviceList user={currentUser ? currentUser : null} devices={devices} />
    </div>
  );
};

export default IndexPage;
