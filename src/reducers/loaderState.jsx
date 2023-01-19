import { createSlice } from '@reduxjs/toolkit'
export const loaderState = createSlice({
  name: 'loader',
  initialState: {
    visible: true,
  },
  reducers: {
    show: (state) => {
      state.visible = true
    },
    hide: (state) => {
      state.visible = false
    },
  },
})
export const { show, hide } = loaderState.actions
export default loaderState.reducer