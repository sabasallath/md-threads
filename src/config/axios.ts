import axios from 'axios';
import store from '../store/store';

const instance = () => {
  const PUBLIC_URL = ((window as unknown) as Record<string, string>).BASE_HREF || '/';

  const axiosAuthInstance = axios.create({
    baseURL: PUBLIC_URL,
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
