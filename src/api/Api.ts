import { useQuery, UseQueryResult } from 'react-query';
import MockApi from './MockApi';
import { ThreadType } from '../types/thread.type';

export function useThreads(enabled: boolean): UseQueryResult<ThreadType[], Error> {
  return useQuery<ThreadType[], Error>(['threads'], MockApi.threads, { enabled });
}

export function useThread(key: string | null, enabled: boolean): UseQueryResult<ThreadType, Error> {
  return useQuery<ThreadType, Error>(['thread', key], () => MockApi.thread(key), { enabled });
}
