import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getTyres = () => api.get(ENDPOINTS.TYRES);

export const createTyre = (tyreData) => {
  const config = {};

  if (tyreData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.TYRES, tyreData, config);
};

export const deleteTyre = (id) =>
  api.delete(`${ENDPOINTS.TYRES}/${id}`);

export const updateTyre = (id, data) => api.put(`${ENDPOINTS.TYRES}/${id}`, data);
