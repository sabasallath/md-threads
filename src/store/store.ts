import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/ui/ui.slice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
