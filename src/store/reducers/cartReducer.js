// src/store/reducers/cartReducer.js
import { UPDATE_CART_ITEM_COUNT } from '../actions/cartActions';

const initialState = {
  itemCount: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CART_ITEM_COUNT:
      return {
        ...state,
        itemCount: action.payload,
      };
    default:
      return state;
  }
};

export default cartReducer;
