import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false}),
    devTools: true
})

export const persistor = persistStore(store)


// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import userReducer from './slices/userSlice';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import jwtDecode from 'jwt-decode';

// const rootReducer = combineReducers({ user: userReducer });

// const jwtExpirationMiddleware = store => next => action => {
//   if (action.type === 'LOGIN_SUCCESS') {
//     const { token } = action.payload;
//     const decodedToken = jwtDecode(token);
//     const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
//     localStorage.setItem('token', token);
//     localStorage.setItem('tokenExpiration', expirationTime);
//   } else if (action.type === 'LOGOUT') {
//     localStorage.removeItem('token');
//     localStorage.removeItem('tokenExpiration');
//   }

//   next(action);
// };

// const persistConfig = {
//   key: 'root',
//   storage,
//   version: 1
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({ serializableCheck: false }).concat(jwtExpirationMiddleware),
//   devTools: true
// });

// export const persistor = persistStore(store); 

