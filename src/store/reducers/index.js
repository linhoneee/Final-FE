// src/store/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer'; // Import cartReducer

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer, // Add cartReducer
});

export default rootReducer;
