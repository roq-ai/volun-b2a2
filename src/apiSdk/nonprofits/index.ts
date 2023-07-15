import axios from 'axios';
import queryString from 'query-string';
import { NonprofitInterface, NonprofitGetQueryInterface } from 'interfaces/nonprofit';
import { GetQueryInterface } from '../../interfaces';

export const getNonprofits = async (query?: NonprofitGetQueryInterface) => {
  const response = await axios.get(`/api/nonprofits${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNonprofit = async (nonprofit: NonprofitInterface) => {
  const response = await axios.post('/api/nonprofits', nonprofit);
  return response.data;
};

export const updateNonprofitById = async (id: string, nonprofit: NonprofitInterface) => {
  const response = await axios.put(`/api/nonprofits/${id}`, nonprofit);
  return response.data;
};

export const getNonprofitById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/nonprofits/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNonprofitById = async (id: string) => {
  const response = await axios.delete(`/api/nonprofits/${id}`);
  return response.data;
};
