import { configureStore } from '@reduxjs/toolkit'
import loaderState from '../reducers/loaderState'
export default configureStore({
    reducer: {
        loader: loaderState,
    },
})