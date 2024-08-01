import axios from 'axios';

const BASE_URL = 'http://localhost:7007/customer-coupons';

class CustomerCouponService {
  getAllCustomerCoupons() {
    return axios.get(BASE_URL);
  }

  createCustomerCoupon(customerCoupon) {
    return axios.post(BASE_URL, customerCoupon);
  }

  getCustomerCouponById(customerCouponId) {
    return axios.get(`${BASE_URL}/${customerCouponId}`);
  }

  updateCustomerCoupon(customerCoupon, customerCouponId) {
    return axios.put(`${BASE_URL}/${customerCouponId}`, customerCoupon);
  }

  deleteCustomerCoupon(customerCouponId) {
    return axios.delete(`${BASE_URL}/${customerCouponId}`);
  }

  applyCoupon(code, orderValue, shippingCost) {
    return axios.post(`${BASE_URL}/apply`, {
      code,
      orderValue,
      shippingCost
    });
  }
}

const instance = new CustomerCouponService();
export default instance;
