import { ThreadNodeType } from '../types/thread.type';

export class ThreadUtil {
  static emptyNode(): ThreadNodeType {
    return {
      isPublic: false,
      author: '',
      title: '',
      descendant: [],
      id: '',
      date: '',
      markdown: '',
    };
  }
}
