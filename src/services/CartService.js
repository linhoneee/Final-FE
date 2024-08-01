import axios from "axios";
import axiosInstance from './axiosInstance';

const URL = "http://localhost:6004/cart";

const URLTestKongGateway = "/cart";

class CartService {
  AddCart(userId, cart) {
    return axios.post(`${URL}/${userId}`, cart);
  }

  FindCartByUserId(userId) {
    return axiosInstance.get(`${URLTestKongGateway}/${userId}`);
  }

  DecreaseCart(userId, cart) {
    return axios.put(`${URL}/${userId}`, cart, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  

  ClearProductInCart(userId, cart) {
    return axios.delete(`${URL}/${userId}`, {
      data: cart,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

const instance = new CartService();
export default instance;
