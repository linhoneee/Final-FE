// import React, { useState } from 'react';
// import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// const CheckoutForm = ({ onPaymentSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setIsLoading(true);

//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       confirmParams: { return_url: 'https://your-ngrok-url/stripe/success' }, // Use your ngrok URL
//     });

//     if (error) {
//       setMessage(error.message);
//     } else {
//       const paymentDetails = {
//         id: paymentIntent.id,
//         clientSecret: paymentIntent.client_secret,
//         amount: paymentIntent.amount,
//         currency: paymentIntent.currency,
//         status: paymentIntent.status,
//       };
//       onPaymentSuccess(paymentDetails);
//     }

//     setIsLoading(false);
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button disabled={isLoading || !stripe || !elements} id="submit">
//         {isLoading ? 'Processing...' : 'Pay now'}
//       </button>
//       {message && <div id="payment-message">{message}</div>}
//     </form>
//   );
// };

// export default CheckoutForm;
