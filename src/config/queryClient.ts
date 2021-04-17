import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5, // 5 seconds
      cacheTime: 1000 * 60,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
