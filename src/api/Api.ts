import { useQuery, UseQueryResult } from 'react-query';
import MockApi from './MockApi';
import { ThreadType } from '../types/thread.type';

export function useThreads(key: string | null): UseQueryResult<ThreadType, Error> {
  return useQuery<ThreadType, Error>(['threads', key], () => MockApi.threads(key));
}
