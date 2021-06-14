import { UseQueryResult } from 'react-query';
import { ThreadViews } from '../types/thread.type';
import { useSelector } from 'react-redux';
import { getThreadsKeys } from '../store/features/thread/thread.slice';
import { useThreads } from '../api/api';

export function useThreadsWrapper(): UseQueryResult<ThreadViews, Error> {
  const { currentThread, token } = useSelector(getThreadsKeys);
  return useThreads(currentThread, token);
}
