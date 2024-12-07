import React from 'react';
import './ShippingTypeListCheckout.css'; // Import the new CSS file

const ShippingTypeList = ({ shippingTypes, selectedShipping, setSelectedShipping }) => (
  <div className="shipping-type-list-container">
    <h3>Loại Giao Hàng</h3>
    <ul className="shipping-type-list">
      {shippingTypes.map(shipping => (
        <li key={shipping.id} className="shipping-type-item">
          <input
            type="checkbox"
            checked={selectedShipping.id === shipping.id}
            onChange={() => setSelectedShipping(shipping)}
          />
          {/* <p className="shipping-id">ID: {shipping.id}</p> */}
          <p className="shipping-name">Tên: {shipping.name}</p>
          <p>Giá Theo Km: ${shipping.pricePerKm}</p>
          <p>Giá Theo Kg: ${shipping.pricePerKg}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ShippingTypeList;
