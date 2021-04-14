import axiosApiInstance from '../config/axios';
import axiosMock from '../config/axiosMock';
import MockData from './MockData';
import { ThreadType } from '../types/thread.type';

class MockApi {
  static threads(): Promise<ThreadType[]> {
    return axiosApiInstance.get('threads').then((res) => res.data);
  }

  static thread(id: string | null): Promise<ThreadType> {
    return axiosApiInstance.get(`thread/${id}`).then((res) => res.data);
  }
}

axiosMock.onGet('threads').reply(200, MockData.threadsAbstract);
axiosMock.onGet(/\/thread\/\w+/).reply((config) => {
  const id = config.url?.replace('thread/', '');
  const thread = MockData.threads.find((e) => e.root.id === id);
  if (thread) return [200, thread];
  throw new Error('Mock data error');
});

export default MockApi;
