import axiosApiInstance from '../config/axios';
import axiosMock from '../config/axiosMock';
import MockData from './MockData';
import { ThreadType } from '../types/thread.type';

class MockApi {
  static threads(id: string | null): Promise<ThreadType> {
    return id
      ? axiosApiInstance.get(`threads/${id}`).then((res) => res.data)
      : axiosApiInstance.get(`threads/`).then((res) => res.data);
  }
}

axiosMock.onGet(/threads\/([a-z0-9-]*)?/).reply((config) => {
  const match = config.url?.match(/threads\/([a-z0-9-]*)?/);
  const id = match?.[1];
  const thread = id ? MockData.threads.find((e) => e.root.id === id) : id;
  return thread ? [200, thread] : [200, MockData.threadsAbstract];
});

export default MockApi;
