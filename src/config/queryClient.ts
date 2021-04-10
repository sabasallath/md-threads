import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
