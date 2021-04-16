import { useQuery, UseQueryResult } from 'react-query';
import MockApi from './mockApi';
import { ThreadType } from '../types/thread.type';
import { TokenType } from '../types/user.type';

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
  return useQuery<TokenType, Error>(['threads', key], () => MockApi.login(key));
}
