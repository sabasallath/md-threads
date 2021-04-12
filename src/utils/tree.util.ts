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
}
