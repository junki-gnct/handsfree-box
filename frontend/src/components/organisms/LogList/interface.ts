import { User } from '@firebase/auth-types';

export interface LogListProps {
  user: User | null;
  logs: LogData[];
}

export interface LogData {
  id: string;
  action: 'open' | 'close';
  date: string;
}
