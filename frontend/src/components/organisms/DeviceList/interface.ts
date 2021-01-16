import { User } from '@firebase/auth-types';

export interface DeviceListProps {
  user: User | null;
  devices: Device[];
}

export interface Device {
  id: string;
  isOnline: boolean;
  isOpen: boolean;
  name: string;
  isConnecting?: boolean;
}
