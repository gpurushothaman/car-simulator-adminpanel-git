import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getSpoilers = () => api.get(ENDPOINTS.TYRES);

export const createSpoiler = (spoilerData) => {
  const config = {};

  if (spoilerData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.SPOILERS, spoilerData, config);
};

export const deleteSpoiler = (id) =>
  api.delete(`${ENDPOINTS.SPOILERS}/${id}`);

export const updateSpoiler = (id, data) => api.put(`${ENDPOINTS.SPOILERS}/${id}`, data);
