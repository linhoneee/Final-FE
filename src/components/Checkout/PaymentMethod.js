import React from 'react';
import './PaymentMethod.css'; // Import the new CSS file

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
  <div className="payment-method-container">
    <h3>Phương Thức Thanh Toán</h3>
    <div className="payment-options">
      <label>
        <input
          type="radio"
          value="paypal"
          checked={paymentMethod === 'paypal'}
          onChange={() => setPaymentMethod('paypal')}
        />
        PayPal
      </label>
      <label>
        <input
          type="radio"
          value="stripe"
          checked={paymentMethod === 'stripe'}
          onChange={() => setPaymentMethod('stripe')}
        />
        Stripe
      </label>
    </div>
  </div>
);

export default PaymentMethod;
