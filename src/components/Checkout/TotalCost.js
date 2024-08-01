import React from 'react';

const TotalCost = ({ totalProductCost, shippingCost, discountResult, totalCost }) => (
  <div>
    <h3>Total Costs</h3>
    <p>Product Total: ${totalProductCost.toFixed(2)}</p>
    {discountResult && discountResult.discountType === 'PRODUCT' && (
      <>
        <p>Discount Amount: ${discountResult.discountAmount.toFixed(2)}</p>
        <p>Discounted Order Value: ${discountResult.discountedOrderValue.toFixed(2)}</p>
      </>
    )}
    <p>Shipping Total: ${shippingCost.toFixed(2)}</p>
    {discountResult && discountResult.discountType === 'SHIPPING' && (
      <>
        <p>Discount Amount: ${discountResult.discountAmount.toFixed(2)}</p>
        <p>Discounted Shipping Cost: ${discountResult.discountedShippingCost.toFixed(2)}</p>
      </>
    )}
    <p>Total Cost: ${totalCost.toFixed(2)}</p>
  </div>
);

export default TotalCost;
