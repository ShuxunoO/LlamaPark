import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '@store/index'

export const slice = createSlice({
  name: 'ui',
  initialState: {
    accountModalOpen: false,
    submitModalParam: {
      open: false,
      type: '',
      hash: '',
      state: '',
      center: true
    }
  },
  reducers: {
    setAccountModalOpen: (state, { payload }) => {
      console.log('payload', payload)
      state.accountModalOpen = payload;
    },
    setSubmitModalParam: (state, { payload }) => {
      state.submitModalParam = { ...state.submitModalParam, ...payload };
    },
    resetSubmitModalParam: (state, { payload }) => {
      state.submitModalParam = payload;
    },
  },
});

export const { setAccountModalOpen, setSubmitModalParam, resetSubmitModalParam } = slice.actions;

export const resetSubmitModalParamFn = () => {
  dispatch(setSubmitModalParam({ open: false }))
  const timer = setTimeout(() => {
    dispatch(resetSubmitModalParam({
      open: false,
      type: '',
      hash: '',
      state: '',
      center: true,
    }))
    clearTimeout(timer)
  }, 300);
}

// getter
export const selectAccountModalOpen = s => s.ui.accountModalOpen;

export const selectSubmitModalParam = s => s.ui.submitModalParam;


export default slice.reducer;
