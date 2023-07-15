import { VolunteerWorkInterface } from 'interfaces/volunteer-work';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface NonprofitInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  volunteer_work?: VolunteerWorkInterface[];
  user?: UserInterface;
  _count?: {
    volunteer_work?: number;
  };
}

export interface NonprofitGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
