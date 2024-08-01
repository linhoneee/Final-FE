// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const paymentDetails = location.state?.paymentDetails;

//   if (!paymentDetails) return <p>No payment details available</p>;

//   return (
//     <div>
//       <h2>Payment Successful</h2>
//       <p>Your payment has been processed successfully.</p>
//       <h3>Payment Details</h3>
//       <p><strong>Payment ID:</strong> {paymentDetails.id}</p>
//       <p><strong>Client Secret:</strong> {paymentDetails.clientSecret}</p>
//       <h4>Items</h4>
//       {paymentDetails.request.items.map((item, index) => (
//         <div key={index}>
//           <p>Product Name: {item.name}</p>
//           <p>Price: {item.price}</p>
//           <p>Quantity: {item.quantity}</p>
//           <p>Weight: {item.weight}</p>
//         </div>
//       ))}
//       <h4>Total</h4>
//       <p>Total Paid: ${paymentDetails.request.total}</p>
//     </div>
//   );
// };

// export default PaymentSuccess;
