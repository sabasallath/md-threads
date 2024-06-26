import React, { createContext } from 'react';
import { ThreadNodeType } from '../../types/thread.type';

export interface TopicContextType {
  handleOnReplyClick: (node: ThreadNodeType) => void;
  handleOnOpenTopicClick: (node: ThreadNodeType) => void;
  rootNodeId: string;
}

export const TopicContext = createContext<TopicContextType>({
  handleOnReplyClick: (node: ThreadNodeType) => {
    return;
  },
  handleOnOpenTopicClick: (node: ThreadNodeType) => {
    return;
  },
  rootNodeId: '',
});
export const useTopicContext = (): TopicContextType => React.useContext(TopicContext);
