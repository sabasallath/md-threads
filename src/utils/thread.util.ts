import {
  FlatThreadNodeType,
  ThreadFlatMap,
  ThreadNodeType,
  ThreadType,
} from '../types/thread.type';
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import assign from 'lodash/assign';
import union from 'lodash/union';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import groupBy from 'lodash/groupBy';

export class ThreadUtil {
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
    };
  }

  private static flatRec(tree: ThreadNodeType[], rootPath: string): FlatThreadNodeType[] {
    function rec(
      nodes: ThreadNodeType[],
      path: string[]
    ): FlatThreadNodeType[] | FlatThreadNodeType[][] {
      return map(nodes, (node) => {
        const newPath = union(path, [node.id]);
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
        fromRootPathToNodeIncluded: thread.root.id,
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
}
