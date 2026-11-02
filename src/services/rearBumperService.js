import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getRearBumpers = () => api.get(ENDPOINTS.REARBUMPERS);

export const createRearBumper = (rearbumperData) => {
  const config = {};

  if (rearbumperData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.REARBUMPERS, rearbumperData, config);
};

export const deleteRearBumper = (id) =>
  api.delete(`${ENDPOINTS.REARBUMPERS}/${id}`);

export const updateRearBumper = (id, data) => api.put(`${ENDPOINTS.REARBUMPERS}/${id}`, data);
