import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/ui/ui.slice';
import threadReducer from './features/thread/thread.slice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    thread: threadReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
