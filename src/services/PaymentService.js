import axios from 'axios';

const processPayment = (data, method) => {
  const url = method === 'paypal' ? 'http://localhost:8009/paypal' : 'http://localhost:8009/stripe';
  return axios.post(url, data)
    .then(response => {
      console.log('API Response:', response.data); // Log API response
      return response;
    })
    .catch(error => {
      console.error('API Error:', error.response ? error.response.data : error.message);
      throw error;
    });
};

const PaymentService = {
  processPayment,
};

export default PaymentService;
