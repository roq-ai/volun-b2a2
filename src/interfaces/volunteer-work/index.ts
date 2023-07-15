import { NonprofitInterface } from 'interfaces/nonprofit';
import { GetQueryInterface } from 'interfaces';

export interface VolunteerWorkInterface {
  id?: string;
  name: string;
  description?: string;
  reward_points: number;
  nonprofit_id?: string;
  created_at?: any;
  updated_at?: any;

  nonprofit?: NonprofitInterface;
  _count?: {};
}

export interface VolunteerWorkGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  nonprofit_id?: string;
}
