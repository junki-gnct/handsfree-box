import { useEffect, useState } from 'react';
import Router from 'next/router';

import { auth, database } from '../utils/Firebase';
import { User } from '@firebase/auth-types';

import UserHeader from '../components/organisms/UserHeader';
import DeviceList from '../components/organisms/DeviceList';
import { Device } from '../components/organisms/DeviceList/interface';

const IndexPage: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : Router.push('/login');
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

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      Router.push('/');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <UserHeader />
      <DeviceList user={currentUser ? currentUser : null} devices={devices} />
      <pre>{JSON.stringify(currentUser, null, 4)}</pre>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default IndexPage;
