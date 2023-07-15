import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BusinessInterface {
  id?: string;
  name: string;
  address: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface BusinessGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  address?: string;
  user_id?: string;
}
