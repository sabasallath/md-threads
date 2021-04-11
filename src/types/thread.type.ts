export interface ThreadNodeType {
  id: string;
  title: string;
  date: string;
  author: string;
  markdown: string;
  isPublic: boolean;
  descendant: ThreadNodeType[];
}

export interface ThreadType {
  root: ThreadNodeType;
}
