import { createSlice } from '@reduxjs/toolkit'
export const loaderState = createSlice({
  name: 'loader',
  initialState: {
    visible: true,
    currency: '$'
  },
  reducers: {
    show: (state) => {
      state.visible = true
    },
    hide: (state) => {
      state.visible = false
    },
    currencyChange: (state) => {
      switch (state.currency) {
        case '$':
          state.currency = 'lb'
          break;
        case 'lb':
          state.currency = '$'
          break;
        default:
          state.currency = '$'
          break;
      }
    }
  },
})
export const { show, hide, currencyChange } = loaderState.actions
export default loaderState.reducer