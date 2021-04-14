import { ThreadType } from '../types/thread.type';
import { RandomUtil } from '../utils/random.util';

class MockData {
  private static genMockData(): ThreadType[] {
    return RandomUtil.genThreads(8, 3, 2, 5, true);
  }
  static readonly threads: ThreadType[] = MockData.genMockData();
  static readonly threadsAbstract: ThreadType[] = RandomUtil.buildAbstract(MockData.threads);
}

export default MockData;
