import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';
import MockApi from './mockApi';
import { ThreadType, ThreadViews } from '../types/thread.type';
import { TokenType } from '../types/user.type';
import { PayloadType } from '../types/payload.type';
import queryClient from '../config/queryClient';
import { ThreadUtil } from '../utils/thread.util';
import cloneDeep from 'lodash/cloneDeep';
import store from '../store/store';
import { uiActions } from '../store/features/ui/ui.slice';

const transformThread = (data: ThreadType): ThreadViews => {
  const flatMap = ThreadUtil.flattenAndGroupById(data);
  const flatten = ThreadUtil.rebuildThreadFromFlatMap(data, flatMap);
  return { nested: data, flatMap, flatten };
};

export function useThreads(
  key: string | null,
  token: TokenType
): UseQueryResult<ThreadViews, Error> {
  return useQuery<ThreadType, Error, ThreadViews>(
    ['threads', key, token?.access_token ? token.access_token : null],
    () => MockApi.threads(key),
    { select: transformThread }
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
        store.dispatch(uiActions.setCouldNotSendReplyError(err.message));
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
