import { createSlice } from '@reduxjs/toolkit';

export interface ThreadSliceType {
  currentThread: string | null;
}

const initialState: ThreadSliceType = {
  currentThread: null,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setOpenThread(state, action) {
      state.currentThread = action.payload;
    },
  },
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
