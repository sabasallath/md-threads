import { TreeNode } from './tree.type';

export interface ThreadNodeBase {
  id: string;
  title: string;
  date: string;
  author: string;
  markdown: string;
  isPublic: boolean;
  isAbstract: boolean;
  isPlaceHolder: boolean; // For optimistic update
}

export interface ThreadNodeType extends ThreadNodeBase, TreeNode<ThreadNodeType> {
  descendant: ThreadNodeType[];
}

export interface ThreadType {
  root: ThreadNodeType;
}

export interface FlatThreadNodeType extends ThreadNodeBase {
  fromRootPathToNodeIncluded: string[];
  level: number;
}

export type ThreadFlatMap = Record<string, FlatThreadNodeType>;
