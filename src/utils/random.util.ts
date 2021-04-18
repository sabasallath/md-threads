import range from 'lodash/range';
import chance from '../config/chance';
import { ThreadNodeBase, ThreadNodeType, ThreadType } from '../types/thread.type';
import { v4 as uuidv4 } from 'uuid';
import { parseISO } from 'date-fns';

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

  static genDateAfterParentBeforeNow(parentMaxIsoDate: string): string {
    return (chance.date({
      min: parseISO(parentMaxIsoDate),
      max: new Date(),
    }) as Date).toISOString();
  }

  private static rootNodeStartDate() {
    return (chance.date({ min: new Date(0), max: new Date() }) as Date).toISOString();
  }

  private static genThreadNodeBase(
    parentIsPublic = false,
    parentMaxIsoDate?: string
  ): ThreadNodeBase {
    return {
      id: uuidv4(),
      title: chance.company(),
      author: chance.name(),
      date: parentMaxIsoDate
        ? this.genDateAfterParentBeforeNow(parentMaxIsoDate)
        : chance.date().toISOString(),
      isPublic: parentIsPublic ? chance.bool({ likelihood: 60 }) : parentIsPublic,
      markdown: this.genMarkdown(),
      isAbstract: false,
      isPlaceHolder: false,
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
    convergeFaster: boolean,
    parentIsPublic: boolean,
    parentIsoDate?: string
  ): ThreadNodeType[] {
    return maxLevel > 0
      ? range(chance.integer({ min: minDescendant, max: maxDescendant })).map(() => {
          const nodeBase = this.genThreadNodeBase(parentIsPublic, parentIsoDate);
          return {
            ...nodeBase,
            descendant: chance.bool({ likelihood: convergeFaster ? 50 : 100 })
              ? this.genThreadNode(
                  maxLevel - 1,
                  minDescendant,
                  maxDescendant,
                  convergeFaster,
                  nodeBase.isPublic,
                  nodeBase.date
                )
              : [],
          };
        })
      : [];
  }

  private static genThreadNodeRoot(
    maxLevel: number,
    minDescendant: number,
    maxDescendant: number,
    convergeFaster: boolean,
    forcePrivate = false
  ): ThreadNodeType {
    const nodeBase = this.genThreadNodeBase(chance.bool({ likelihood: forcePrivate ? 0 : 80 }));
    nodeBase.date = this.rootNodeStartDate();
    return {
      ...nodeBase,
      descendant:
        maxLevel > 0
          ? this.genThreadNode(
              maxLevel,
              minDescendant,
              maxDescendant,
              convergeFaster,
              nodeBase.isPublic,
              nodeBase.date
            )
          : [],
    };
  }

  static genThread(
    maxLevel: number,
    minDescendant: number,
    maxDescendant: number,
    convergeFaster = false,
    forcePrivate = false
  ): ThreadType {
    return {
      root: this.genThreadNodeRoot(
        maxLevel,
        minDescendant,
        maxDescendant,
        convergeFaster,
        forcePrivate
      ),
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
}
