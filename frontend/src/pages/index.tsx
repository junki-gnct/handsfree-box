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
        setToken();
      } else {
        Router.push('/login');
      }
    });

    const setToken = async (): Promise<void> => {
      try {
        const token = firebaseCloudMessaging.init();
        if (token) {
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getMessage = (): void => {
      const config = {
        apiKey: process.env.FIREBASE_KEY,
        authDomain: process.env.FIREBASE_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };

      if (!firebase.app.length) {
        firebase.initializeApp(config);
      }
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
          const device: Device = {
            id: key,
            isOnline: data.isOnline,
            isOpen: data.isOpen,
            name: data.name,
          };
          devicelist.push(device);
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
