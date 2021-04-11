import range from 'lodash/range';
import chance from '../config/chance';
import { ThreadNodeType, ThreadRootNodeType, ThreadType } from '../types/thread.type';
import { v4 as uuidv4 } from 'uuid';

export class RandomUtil {
  static lorem(p: number): string[] {
    return p > 0
      ? range(p).map(() => {
          return chance.paragraph({});
        })
      : [];
  }

  static genMarkdown(min = 1, max = 3): string {
    return RandomUtil.lorem(chance.integer({ min, max })).join('\n\n\n');
  }

  private static genThreadNodeFactorial(n: number): ThreadNodeType[] {
    return n > 0
      ? range(n).map(() => {
          return {
            id: uuidv4(),
            title: chance.company(),
            author: chance.name(),
            date: chance.date().toISOString(),
            isPublic: chance.bool(),
            markdown: this.genMarkdown(),
            descendant: this.genThreadNodeFactorial(n - 1),
          };
        })
      : [];
  }

  private static genThreadNodeRootFactorial(n: number): ThreadRootNodeType {
    return {
      id: uuidv4(),
      title: chance.company(),
      author: chance.name(),
      descendant: n > 0 ? this.genThreadNodeFactorial(n) : [],
    };
  }

  static genThreadFactorial(n: number): ThreadType {
    return { root: this.genThreadNodeRootFactorial(n) };
  }

  private static genThreadNode(
    maxLevel: number,
    minDescendant: number,
    maxDescendant: number,
    convergeFaster: boolean
  ): ThreadNodeType[] {
    return maxLevel > 0
      ? range(chance.integer({ min: minDescendant, max: maxDescendant })).map(() => {
          return {
            id: uuidv4(),
            title: chance.company(),
            author: chance.name(),
            date: chance.date().toISOString(),
            isPublic: chance.bool(),
            markdown: this.genMarkdown(),
            descendant: chance.bool({ likelihood: convergeFaster ? 50 : 100 })
              ? this.genThreadNode(maxLevel - 1, minDescendant, maxDescendant, convergeFaster)
              : [],
          };
        })
      : [];
  }

  private static genThreadNodeRoot(
    maxLevel: number,
    minDescendant: number,
    maxDescendant: number,
    convergeFaster: boolean
  ): ThreadRootNodeType {
    return {
      id: uuidv4(),
      title: chance.company(),
      author: chance.name(),
      descendant:
        maxLevel > 0
          ? this.genThreadNode(maxLevel, minDescendant, maxDescendant, convergeFaster)
          : [],
    };
  }

  static genThread(
    maxLevel: number,
    minDescendant: number,
    maxDescendant: number,
    convergeFaster = false
  ): ThreadType {
    return { root: this.genThreadNodeRoot(maxLevel, minDescendant, maxDescendant, convergeFaster) };
  }
}
