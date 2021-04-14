import { createSlice } from '@reduxjs/toolkit';
import { RandomUtil } from '../../../utils/random.util';
import { ThreadType } from '../../../types/thread.type';

export interface ThreadSliceType {
  threads: ThreadType[];
  currentThread: ThreadType | null;
}

const initialState: ThreadSliceType = {
  threads: RandomUtil.genThreads(8, 3, 2, 5, true),
  currentThread: null,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setOpenThread(state, action) {
      const currentThread = state.threads.filter((thread) => thread.root.id === action.payload);
      state.currentThread = currentThread[0] ? currentThread[0] : null;
    },
  },
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
