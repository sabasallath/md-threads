import { ThreadFlatMap } from '../types/thread.type';
import { useThreadsWrapper } from './useThreadsWrapper';

export function useFlatMap(): ThreadFlatMap | null {
  const threads = useThreadsWrapper();
  return !threads.isLoading && !threads.isError && threads.data ? threads.data.flatMap : null;
}
