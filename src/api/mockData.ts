import { ThreadType } from '../types/thread.type';
import { RandomUtil } from '../utils/random.util';
import { ThreadUtil } from '../utils/thread.util';

class MockData {
  private static genMockData(): ThreadType[] {
    return RandomUtil.genThreads(8, 3, 2, 5, true);
  }

  // Mocked backend data
  static threads: ThreadType[] = MockData.genMockData();
  static readonly threadsAbstract: ThreadType = ThreadUtil.buildAbstract(MockData.threads);
}

export default MockData;
