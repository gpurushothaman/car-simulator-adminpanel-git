import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getSteerings = () => api.get(ENDPOINTS.STEERINGS);

export const createSteering = (steeringData) => {
  const config = {};

  if (steeringData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.STEERINGS, steeringData, config);
};

export const deleteSteering = (id) =>
  api.delete(`${ENDPOINTS.STEERINGS}/${id}`);

export const updateSteering = (id, data) => api.put(`${ENDPOINTS.STEERINGS}/${id}`, data);
