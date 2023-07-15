import axios from 'axios';
import queryString from 'query-string';
import { RewardInterface, RewardGetQueryInterface } from 'interfaces/reward';
import { GetQueryInterface } from '../../interfaces';

export const getRewards = async (query?: RewardGetQueryInterface) => {
  const response = await axios.get(`/api/rewards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createReward = async (reward: RewardInterface) => {
  const response = await axios.post('/api/rewards', reward);
  return response.data;
};

export const updateRewardById = async (id: string, reward: RewardInterface) => {
  const response = await axios.put(`/api/rewards/${id}`, reward);
  return response.data;
};

export const getRewardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rewards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRewardById = async (id: string) => {
  const response = await axios.delete(`/api/rewards/${id}`);
  return response.data;
};
