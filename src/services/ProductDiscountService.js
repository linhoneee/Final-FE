import axios from 'axios';

const BASE_URL = 'http://localhost:7007/product-discounts';

class ProductDiscountService {
  getAllProductDiscounts() {
    return axios.get(BASE_URL);
  }

  createProductDiscount(productDiscount) {
    return axios.post(BASE_URL, productDiscount);
  }

  getProductDiscountById(productDiscountId) {
    return axios.get(`${BASE_URL}/product/${productDiscountId}`);
  }

  updateProductDiscount(productDiscount, productDiscountId) {
    return axios.put(`${BASE_URL}/${productDiscountId}`, productDiscount);
  }

  deleteProductDiscount(productDiscountId) {
    return axios.delete(`${BASE_URL}/${productDiscountId}`);
  }
}

const instance = new ProductDiscountService();
export default instance;
