import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getFrontBumpers = () => api.get(ENDPOINTS.FRONTBUMPERS);

export const createFrontBumper = (frontbumperData) => {
  const config = {};

  if (frontbumperData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.FRONTBUMPERS, frontbumperData, config);
};

export const deleteFrontBumper = (id) =>
  api.delete(`${ENDPOINTS.FRONTBUMPERS}/${id}`);

export const updateFrontBumper = (id, data) => api.put(`${ENDPOINTS.FRONTBUMPERS}/${id}`, data);
