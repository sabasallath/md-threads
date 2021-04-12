import { createSlice } from '@reduxjs/toolkit';
import { RandomUtil } from '../../../utils/random.util';

const initialState = {
  threads: RandomUtil.genThreads(4),
  currentThread: null,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {},
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
