import React from 'react';

const ShippingTypeList = ({ shippingTypes, selectedShipping, setSelectedShipping }) => (
  <div>
    <h3>Shipping Types</h3>
    <ul>
      {shippingTypes.map(shipping => (
        <li key={shipping.id}>
          <input
            type="checkbox"
            checked={selectedShipping.id === shipping.id}
            onChange={() => setSelectedShipping(shipping)}
          />
          <p>ID: {shipping.id}</p>
          <p>Name: {shipping.name}</p>
          <p>Price per Km: ${shipping.pricePerKm}</p>
          <p>Price per Kg: ${shipping.pricePerKg}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ShippingTypeList;
