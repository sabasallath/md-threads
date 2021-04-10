import axios from 'axios';

const instance = () => {
  const PUBLIC_URL = ((window as unknown) as Record<string, string>).BASE_HREF || '/';

  const axiosAuthInstance = axios.create({
    baseURL: PUBLIC_URL,
  });

  axiosAuthInstance.interceptors.request.use(
    async (config) => {
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
