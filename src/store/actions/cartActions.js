// src/store/actions/cartActions.js
import CartService from '../../services/CartService';
export const UPDATE_CART_ITEM_COUNT = 'UPDATE_CART_ITEM_COUNT';


export const updateCartItemCount = (count) => {
  return {
    type: UPDATE_CART_ITEM_COUNT,
    payload: count,
  };
};

export const fetchCartItemCount = (userID) => {
  return async (dispatch) => {
    try {
      const cartResponse = await CartService.FindCartByUserId(userID);
      const items = cartResponse.data.items ? JSON.parse(cartResponse.data.items) : [];
      const itemCount = items.reduce((count, item) => count + item.quantity, 0);
      dispatch(updateCartItemCount(itemCount));
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };
};
