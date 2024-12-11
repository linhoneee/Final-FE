import React from 'react';
import './TotalCost.css'; // Import the new CSS file

const TotalCost = ({ totalProductCost, shippingCost, discountResult, totalCost }) => (
  <div className="total-cost-container">
    <h3>Tổng Tiền</h3>
    <p className="cost-item">Tổng Tiền Hàng: <span>${totalProductCost.toFixed(2)}</span></p>
    {discountResult && discountResult.discountType === 'PRODUCT' && (
      <>
        <p className="cost-item">Số tiền giảm: <span>${discountResult.discountAmount.toFixed(2)}</span></p>
        <p className="cost-item">Tiền hàng sau khi giảm: <span>${discountResult.discountedOrderValue.toFixed(2)}</span></p>
      </>
    )}
    <p className="cost-item">Tổng Tiền Vận Chuyển : <span>${shippingCost.toFixed(2)}</span></p>
    {discountResult && discountResult.discountType === 'SHIPPING' && (
      <>
        <p className="cost-item">Số tiền giảm: <span>${discountResult.discountAmount.toFixed(2)}</span></p>
        <p className="cost-item">Tiền vận chuyển sau giảm: <span>${discountResult.discountedShippingCost.toFixed(2)}</span></p>
      </>
    )}
    <p className="total-cost">Tổng: <span>${totalCost.toFixed(2)}</span></p>
  </div>
);

export default TotalCost;
