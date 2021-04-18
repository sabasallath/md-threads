import {
  FlatThreadNodeType,
  ThreadFlatMap,
  ThreadNodeBase,
  ThreadNodeType,
  ThreadType,
} from '../types/thread.type';
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import assign from 'lodash/assign';
import concat from 'lodash/concat';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import union from 'lodash/union';
import groupBy from 'lodash/groupBy';
import clone from 'lodash/clone';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, parseISO } from 'date-fns';

export class ThreadUtil {
  static buildNode(partialNode: Partial<ThreadNodeType>): ThreadNodeType {
    return {
      isPublic: partialNode?.isPublic !== undefined ? partialNode?.isPublic : true,
      author: partialNode?.author !== undefined ? partialNode?.author : '',
      title: partialNode?.title !== undefined ? partialNode?.title : '',
      descendant: partialNode?.descendant !== undefined ? partialNode?.descendant : [],
      id: partialNode?.id !== undefined ? partialNode?.id : uuidv4(),
      date: partialNode?.date !== undefined ? partialNode?.date : new Date().toISOString(),
      markdown: partialNode?.markdown !== undefined ? partialNode?.markdown : '',
      isAbstract:
        partialNode?.isAbstract !== undefined ? partialNode?.isAbstract : !!partialNode?.descendant,
      isPlaceHolder: partialNode?.isPlaceHolder !== undefined ? partialNode?.isPlaceHolder : false,
    };
  }

  static emptyNode(descendant: ThreadNodeType[] = []): ThreadNodeType {
    return {
      isPublic: false,
      author: '',
      title: '',
      descendant: descendant,
      id: '',
      date: descendant ? new Date().toISOString() : '',
      markdown: '',
      isAbstract: !!descendant,
      isPlaceHolder: false,
    };
  }

  private static flatRec(tree: ThreadNodeType[], rootPath: string): FlatThreadNodeType[] {
    function rec(
      nodes: ThreadNodeType[],
      path: string[]
    ): FlatThreadNodeType[] | FlatThreadNodeType[][] {
      return map(nodes, (node) => {
        const newPath = concat(path, node.id);
        if (!node.descendant) {
          return [
            assign(
              {
                fromRootPathToNodeIncluded: newPath,
                level: path.length,
              },
              node
            ),
          ];
        } else {
          return [
            assign(
              {
                fromRootPathToNodeIncluded: newPath,
                level: path.length,
              },
              omit(node, 'descendant')
            ),
            rec(node.descendant, newPath),
            /* eslint-disable  @typescript-eslint/no-explicit-any */
          ] as any;
        }
      });
    }
    return flattenDeep(rec(tree, [rootPath]));
  }

  private static flatten(thread: ThreadType): FlatThreadNodeType[] {
    const flattenDescendant = this.flatRec(thread.root.descendant, thread.root.id);
    const flattenRoot = (assign(
      {
        fromRootPathToNodeIncluded: [thread.root.id],
        level: 0,
      },
      omit(thread.root, 'descendant')
    ) as unknown) as FlatThreadNodeType;
    return union(flattenDescendant, [flattenRoot]);
  }

  static flattenAndGroupById(thread: ThreadType): ThreadFlatMap {
    return reduce(
      groupBy(this.flatten(thread), 'id'),
      (result, value, key) => {
        result[key] = value[0];
        return result;
      },
      {}
    );
  }

  private static buildAbstractThread(thread: ThreadType): ThreadNodeType {
    return {
      ...thread.root,
      descendant: [],
      isAbstract: true,
      markdown: `${thread.root.markdown.substr(0, 150)}...`,
    };
  }

  static buildAbstract(threads: ThreadType[]): ThreadType {
    return {
      root: ThreadUtil.emptyNode(threads.map((thread) => this.buildAbstractThread(thread))),
    };
  }

  static privatize(thread: ThreadType): ThreadType {
    function privatizeNode(node: ThreadNodeBase, level: number): ThreadNodeBase {
      return !node.isPublic
        ? {
            ...node,
            title: !level || node.isAbstract ? node.title : '',
            author: '******',
            markdown: '',
          }
        : node;
    }

    function privatizeNodeRec(node: ThreadNodeType, level: number): ThreadNodeType {
      return {
        ...privatizeNode(node, level),
        descendant: node.descendant.map((e) => privatizeNodeRec(e, level + 1)),
      };
    }

    function privatizeRoot(thread: ThreadType): ThreadType {
      const rootLevel = 0;
      return {
        root: {
          ...privatizeNode(thread.root, rootLevel),
          descendant: thread.root.descendant.map((e) => privatizeNodeRec(e, rootLevel + 1)),
        },
      };
    }

    if (thread) {
      return privatizeRoot(thread);
    } else {
      return thread;
    }
  }

  static insertNodeInThread(
    fromRootPathToNodeExcluded: string[],
    thread: ThreadType,
    node: ThreadNodeType
  ): string[] | null {
    const paths = clone(fromRootPathToNodeExcluded);
    if (paths.length === 1 && thread.root.id === paths[0]) {
      thread.root.descendant.push(node);
      paths.push(node.id);
      return paths;
    } else if (paths.length > 1) {
      let currentNode: ThreadNodeType | undefined = thread.root;
      const isInPath = (e: ThreadNodeType, path: string | undefined) => e.id === path;
      paths.shift();
      for (let path: string | undefined = paths[0]; paths.length; ) {
        path = paths.shift();
        currentNode = currentNode?.descendant.find((e) => isInPath(e, path));
      }

      if (currentNode) {
        currentNode.descendant.push(node);
        fromRootPathToNodeExcluded.push(node.id);
        return fromRootPathToNodeExcluded;
      }
    }

    return null;
  }

  static compareNodeByDate(): (a: ThreadNodeType, b: ThreadNodeType) => number {
    return (a, b) => (isBefore(parseISO(a.date), parseISO(b.date)) ? -1 : 1);
  }

  static sortByDate(unsortedNodes: ThreadNodeType[]): ThreadNodeType[] {
    return unsortedNodes.sort(this.compareNodeByDate());
  }
  static rebuildThreadFromFlatMap(data: ThreadType, flattenThread: ThreadFlatMap): ThreadType {
    return {
      ...data,
      root: {
        ...data.root,
        descendant: Object.values(flattenThread)
          .filter((e) => e.level !== 0) // remove root node
          .map((flatNode) => ({ ...flatNode, descendant: [] } as ThreadNodeType)),
      },
    };
  }
}
