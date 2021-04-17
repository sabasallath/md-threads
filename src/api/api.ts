import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';
import MockApi from './mockApi';
import { ThreadType } from '../types/thread.type';
import { TokenType } from '../types/user.type';
import { PayloadType } from '../types/payload.type';
import queryClient from '../config/queryClient';
import { ThreadUtil } from '../utils/thread.util';
import cloneDeep from 'lodash/cloneDeep';

export function useThreads(
  key: string | null,
  token: TokenType
): UseQueryResult<ThreadType, Error> {
  return useQuery<ThreadType, Error>(
    ['threads', key, token?.access_token ? token.access_token : null],
    () => MockApi.threads(key)
  );
}

export function useLogin(key: string | null): UseQueryResult<TokenType, Error> {
  return useQuery<TokenType, Error>(['/auth/login', key], () => MockApi.login(key));
}

function optimisticUpdate(old: ThreadType, payload: PayloadType): ThreadType {
  const node = ThreadUtil.buildNode({
    markdown: payload?.markdown,
    title: payload?.title,
    isPublic: payload?.isPublic,
    author: payload?.author,
    isPlaceHolder: true,
  });
  const clone = cloneDeep(old);
  const success = ThreadUtil.insertNodeInThread(
    cloneDeep(payload.fromRootPathToNodeExcluded),
    clone,
    node
  );
  return success ? clone : old;
}

interface ReplyContext {
  previousDataSnapshot: ThreadType | undefined;
}

export function useReply(
  key: string,
  rootNodeId: string,
  token: TokenType
): UseMutationResult<void, Error, PayloadType> {
  const queryKey = ['threads', rootNodeId, token?.access_token ? token.access_token : null];

  return useMutation<void, Error, PayloadType>(
    ['reply', key],
    (payload) => MockApi.reply(payload),
    {
      onMutate: async (payload) => {
        const previousDataSnapshot = queryClient.getQueryData(queryKey);

        // Cancel any outgoing refetches that will overwrite the optimistic update
        await queryClient.cancelQueries(queryKey);

        queryClient.setQueryData(queryKey, (old) => optimisticUpdate(old as ThreadType, payload));

        return { previousDataSnapshot };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(queryKey, (context as ReplyContext)?.previousDataSnapshot);
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          'threads',
          rootNodeId,
          token?.access_token ? token.access_token : null,
        ]);
      },
    }
  );
}
