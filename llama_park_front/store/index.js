import { configureStore } from '@reduxjs/toolkit';

import user from './user'
import ui from './ui'

const isDev = process.env.NODE_ENV === 'development';
const store = configureStore({
  reducer: {
    ui,
    user,
  },
  devTools: isDev,
});

export default store;

export const { dispatch, subscribe } = store

export const getState = (sliceName) => {
  const _store = store.getState()
  return sliceName ? _store[sliceName] : _store
}