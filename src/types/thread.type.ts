export interface ThreadRootNodeType {
  id: string;
  title: string;
  descendant: ThreadNodeType[];
  author: string;
}

export interface ThreadNodeType extends ThreadRootNodeType {
  date: string;
  isPublic: boolean;
  markdown: string;
}

export interface ThreadType {
  root: ThreadRootNodeType;
}
