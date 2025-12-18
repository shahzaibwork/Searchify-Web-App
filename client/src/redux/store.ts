//@ts-nocheck

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from "./productSlice"
import userReducer from "./userSlice"
import prefetchReducer from "./prefetchSlice"
import pageReducer from "./pageSlice"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import socketMiddleware from './middlewares/socket-middleware'

const rootReducer = combineReducers({
    product: productReducer,
    user: userReducer,
    pages: pageReducer
})

const presistConfig = {
    key: 'root',
    storage,
    version: 1
}

const persistedReducer = persistReducer(presistConfig, rootReducer)

export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false}).concat(socketMiddleware) 
})


export const persistor = persistStore(store)