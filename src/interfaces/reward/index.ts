import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RewardInterface {
  id?: string;
  points: number;
  coupon_code: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface RewardGetQueryInterface extends GetQueryInterface {
  id?: string;
  coupon_code?: string;
  user_id?: string;
}
