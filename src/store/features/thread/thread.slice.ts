import { createSlice } from '@reduxjs/toolkit';
import { ThreadFlatMap, ThreadType } from '../../../types/thread.type';
import { ThreadUtil } from '../../../utils/thread.util';

export interface ThreadSliceType {
  currentThread: string | null;
  flatMap: ThreadFlatMap | null;
  flattenThread: ThreadType | null;
}

const initialState: ThreadSliceType = {
  currentThread: null,
  flatMap: null,
  flattenThread: null,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setOpenThread(state, action) {
      state.currentThread = action.payload;
    },
    setFlatMap(state, action) {
      state.flatMap = ThreadUtil.flattenAndGroupById(action.payload);
      state.flattenThread = ThreadUtil.rebuildThreadFromFlatMap(action.payload, state.flatMap);
    },
  },
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
