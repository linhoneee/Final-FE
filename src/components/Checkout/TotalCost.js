import React from 'react';
import './TotalCost.css'; // Import the new CSS file

const TotalCost = ({ totalProductCost, shippingCost, discountResult, totalCost }) => (
  <div className="total-cost-container">
    <h3>Total Costs</h3>
    <p className="cost-item">Product Total: <span>${totalProductCost.toFixed(2)}</span></p>
    {discountResult && discountResult.discountType === 'PRODUCT' && (
      <>
        <p className="cost-item">Discount Amount: <span>${discountResult.discountAmount.toFixed(2)}</span></p>
        <p className="cost-item">Discounted Order Value: <span>${discountResult.discountedOrderValue.toFixed(2)}</span></p>
      </>
    )}
    <p className="cost-item">Shipping Total: <span>${shippingCost.toFixed(2)}</span></p>
    {discountResult && discountResult.discountType === 'SHIPPING' && (
      <>
        <p className="cost-item">Discount Amount: <span>${discountResult.discountAmount.toFixed(2)}</span></p>
        <p className="cost-item">Discounted Shipping Cost: <span>${discountResult.discountedShippingCost.toFixed(2)}</span></p>
      </>
    )}
    <p className="total-cost">Total Cost: <span>${totalCost.toFixed(2)}</span></p>
  </div>
);

export default TotalCost;
