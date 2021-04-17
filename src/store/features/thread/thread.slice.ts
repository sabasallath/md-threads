import { createSlice } from '@reduxjs/toolkit';
import { ThreadFlatMap } from '../../../types/thread.type';
import { ThreadUtil } from '../../../utils/thread.util';

export interface ThreadSliceType {
  currentThread: string | null;
  flattenThread: ThreadFlatMap | null;
}

const initialState: ThreadSliceType = {
  currentThread: null,
  flattenThread: null,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setOpenThread(state, action) {
      state.currentThread = action.payload;
    },
    setFlattenThread(state, action) {
      // todo loading status
      state.flattenThread = ThreadUtil.flattenAndGroupById(action.payload);
    },
  },
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
