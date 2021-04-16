import { createSlice } from '@reduxjs/toolkit';
import chance from '../../../config/chance';
import { UserType } from '../../../types/user.type';

type UserSliceType = UserType;

const initialState: UserSliceType = {
  userName: null,
  token: {
    access_token: '',
    token_type: 'Bearer', // todo remove
  },
  loggingLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state) {
      if (state.userName) {
        state.userName = null;
      } else {
        state.userName = chance.name();
      }
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setLoggingLoading(state, action) {
      state.loggingLoading = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
