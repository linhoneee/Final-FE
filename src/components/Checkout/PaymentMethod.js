import React from 'react';

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
  <div>
    <h3>Payment Method</h3>
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
);

export default PaymentMethod;
