import range from 'lodash/range';
import chance from '../config/chance';
import { ThreadNodeBase, ThreadNodeType, ThreadType } from '../types/thread.type';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';

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

  private static genThreadNodeBase(): ThreadNodeBase {
    return {
      id: uuidv4(),
      title: chance.company(),
      author: chance.name(),
      date: chance.date().toISOString(),
      isPublic: chance.bool(),
      markdown: this.genMarkdown(),
      isAbstract: false,
    };
  }

  private static genThreadNodeRegularDecrease(n: number): ThreadNodeType[] {
    return n > 0
      ? range(n).map(() => {
          return {
            ...this.genThreadNodeBase(),
            descendant: this.genThreadNodeRegularDecrease(n - 1),
          };
        })
      : [];
  }

  private static genThreadNodeRootRegularDecrease(n: number): ThreadNodeType {
    return {
      ...this.genThreadNodeBase(),
      descendant: n > 0 ? this.genThreadNodeRegularDecrease(n) : [],
    };
  }

  static genThreadRegularDecrease(n: number): ThreadType {
    return { root: this.genThreadNodeRootRegularDecrease(n) };
  }

  private static genThreadNodeRegular(n: number, level: number): ThreadNodeType[] {
    if (!level) return [];
    return n > 0
      ? range(n).map(() => {
          return {
            ...this.genThreadNodeBase(),
            descendant: this.genThreadNodeRegular(n, level - 1),
          };
        })
      : [];
  }

  private static genThreadNodeRootRegular(n: number, level: number): ThreadNodeType {
    return {
      ...this.genThreadNodeBase(),
      descendant: n > 0 ? this.genThreadNodeRegular(n, level - 1) : [],
    };
  }

  static genThreadRegular(n: number): ThreadType {
    return { root: this.genThreadNodeRootRegular(n, n) };
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
            ...this.genThreadNodeBase(),
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
  ): ThreadNodeType {
    return {
      ...this.genThreadNodeBase(),
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
    return {
      root: this.genThreadNodeRoot(maxLevel, minDescendant, maxDescendant, convergeFaster),
    };
  }

  static genThreads(
    n: number,
    maxLevel = 4,
    minDescendant = 3,
    maxDescendant = 5,
    convergeFaster = true
  ): ThreadType[] {
    return n > 0
      ? range(n).map(() => this.genThread(maxLevel, minDescendant, maxDescendant, convergeFaster))
      : [];
  }
  private static buildAbstractThread(thread: ThreadType) {
    const clone = cloneDeep(thread);
    clone.root.descendant = [];
    clone.root.markdown = clone.root.markdown.substr(0, 100) + '...';
    clone.root.isAbstract = true;
    return clone;
  }

  static buildAbstract(threads: ThreadType[]): ThreadType[] {
    return threads.map((thread) => this.buildAbstractThread(thread));
  }
}
