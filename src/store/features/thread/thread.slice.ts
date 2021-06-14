import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThreadNodeType } from '../../../types/thread.type';
import { RootState } from '../../store';

export interface ThreadSliceType {
  currentThread: string | null;
  loadingNode?: ThreadNodeType;
}

const initialState: ThreadSliceType = {
  currentThread: null,
  loadingNode: undefined,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setOpenThread(state, { payload }: PayloadAction<ThreadNodeType | undefined>) {
      if (payload) {
        state.currentThread = payload.id;
      } else {
        state.currentThread = null;
      }
      state.loadingNode = payload;
    },
  },
});

const getCurrentThread = (state: RootState) => state.thread.currentThread;
const getToken = (state: RootState) => state.user.token;

export const getThreadsKeys = createSelector(
  [getCurrentThread, getToken],
  (currentThread, token) => ({
    currentThread,
    token,
  })
);

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
