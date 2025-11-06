import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notesReducer from './slices/notesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
