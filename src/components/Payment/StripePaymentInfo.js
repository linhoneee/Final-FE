// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckoutForm';

// const stripePromise = loadStripe('pk_test_51POEJC08hx6m8TqOLOwxxoXy3sIC0tbn5aCOhshra7asAjGRxTLmKPAcDvQckVPKq68WrYdn6OWLNnKjf74wf65600upt0IaNq');

// const StripePaymentInfo = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const paymentInfo = location.state?.paymentInfo;

//   const [clientSecret, setClientSecret] = useState('');

//   useEffect(() => {
//     if (paymentInfo) {
//       setClientSecret(paymentInfo.clientSecret);
//     }
//   }, [paymentInfo]);

//   const handlePaymentSuccess = (paymentDetails) => {
//     navigate('/stripe/success', { state: { paymentDetails } });
//   };

//   const appearance = { theme: 'stripe' };
//   const options = { clientSecret, appearance };

//   if (!paymentInfo) return <p>No payment information available</p>;

//   return (
//     <div>
//       <h3>Stripe Payment Information</h3>
//       {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
//         </Elements>
//       )}
//       <h4>Payment Details</h4>
//       <p><strong>Payment ID:</strong> {paymentInfo.id}</p>
//       <p><strong>Client Secret:</strong> {paymentInfo.clientSecret}</p>
//       <h4>Items</h4>
//       {paymentInfo.request.items.map((item, index) => (
//         <div key={index}>
//           <p>Product Name: {item.name}</p>
//           <p>Price: {item.price}</p>
//           <p>Quantity: {item.quantity}</p>
//           <p>Weight: {item.weight}</p>
//         </div>
//       ))}
//       <h4>Total</h4>
//       <p>Total Paid: ${paymentInfo.request.total}</p>
//     </div>
//   );
// };

// export default StripePaymentInfo;
