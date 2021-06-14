import axios from 'axios';
import store from '../store/store';
import { href } from './path';

const instance = () => {
  const axiosAuthInstance = axios.create({
    baseURL: href(),
  });

  axiosAuthInstance.interceptors.request.use(
    async (config) => {
      if (config.url?.includes('token')) return config;
      const token = store.getState().user.token ?? '';
      config.headers.authorization = token.access_token
        ? `${token.token_type} ${token.access_token}`
        : '';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axiosAuthInstance;
};

const axiosApiInstance = instance();
export default axiosApiInstance;
