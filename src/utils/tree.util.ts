import { TreeNode } from '../types/tree.type';

export class TreeUtil {
  static nbNodes(root: TreeNode<unknown>): number {
    const count = (node: TreeNode<unknown>): number => {
      return node.descendant.reduce((acc, e) => {
        acc += 1 + count(e);
        return acc;
      }, 0);
    };
    return 1 + count(root);
  }

  /**
   * The root node count as the first level
   *     o     A tree with n=3, level=2
   *    /|\    (3² - 1) / (3 - 1) = 4
   *   o o o
   * @param n: number of nodes per level
   * @param level: tree level
   */
  static nbNodesInRegularTree(n: number, level: number): number {
    if (n === 1) return level;
    return (Math.pow(n, level) - 1) / (n - 1);
  }
}
