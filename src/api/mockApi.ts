import axiosApiInstance from '../config/axios';
import axiosMock from '../config/axiosMock';
import MockData from './mockData';
import { ThreadType } from '../types/thread.type';
import { TokenType } from '../types/user.type';
import { v4 as uuidv4 } from 'uuid';
import { ThreadUtil } from '../utils/thread.util';

class MockApi {
  static threads(id: string | null): Promise<ThreadType> {
    return id
      ? axiosApiInstance.get(`threads/${id}`).then((res) => res.data)
      : axiosApiInstance.get(`threads/`).then((res) => res.data);
  }

  static login(user: string | null): Promise<TokenType> {
    return axiosApiInstance.post('/auth/login', { user }).then((res) => res.data);
  }
}

axiosMock.onGet(/threads\/([a-z0-9-]*)?/).reply((config) => {
  const match = config.url?.match(/threads\/([a-z0-9-]*)?/);
  const id = match?.[1];
  const hasToken = config?.headers?.authorization.match(/Bearer ([a-z0-9-]*)?/)?.[1];

  const thread = id ? MockData.threads.find((e) => e.root.id === id) : null;
  return thread
    ? [200, !hasToken ? ThreadUtil.privatize(thread) : thread]
    : [200, !hasToken ? ThreadUtil.privatize(MockData.threadsAbstract) : MockData.threadsAbstract];
});

axiosMock.onPost('/auth/login').reply((config) => {
  const user = JSON.parse(config?.data).user;
  return user
    ? [200, { access_token: uuidv4(), token_type: 'Bearer' }]
    : [200, { access_token: '', token_type: 'Bearer' }];
});

export default MockApi;
