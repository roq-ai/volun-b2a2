import axios from 'axios';
import queryString from 'query-string';
import { VolunteerWorkInterface, VolunteerWorkGetQueryInterface } from 'interfaces/volunteer-work';
import { GetQueryInterface } from '../../interfaces';

export const getVolunteerWorks = async (query?: VolunteerWorkGetQueryInterface) => {
  const response = await axios.get(`/api/volunteer-works${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVolunteerWork = async (volunteerWork: VolunteerWorkInterface) => {
  const response = await axios.post('/api/volunteer-works', volunteerWork);
  return response.data;
};

export const updateVolunteerWorkById = async (id: string, volunteerWork: VolunteerWorkInterface) => {
  const response = await axios.put(`/api/volunteer-works/${id}`, volunteerWork);
  return response.data;
};

export const getVolunteerWorkById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/volunteer-works/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVolunteerWorkById = async (id: string) => {
  const response = await axios.delete(`/api/volunteer-works/${id}`);
  return response.data;
};
