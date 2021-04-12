import { TreeNode } from './tree.type';

export interface ThreadNodeBase {
  id: string;
  title: string;
  date: string;
  author: string;
  markdown: string;
  isPublic: boolean;
}

export interface ThreadNodeType extends ThreadNodeBase, TreeNode<ThreadNodeType> {
  descendant: ThreadNodeType[];
}

export interface ThreadType {
  root: ThreadNodeType;
}

export interface FlatThreadNodeType extends ThreadNodeBase {
  fromRootPathToNodeIncluded: FlatThreadNodeType[];
  level: number;
}

export type ThreadFlatMap = Record<string, FlatThreadNodeType>;
