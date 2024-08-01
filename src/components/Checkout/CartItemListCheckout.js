import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartItemListCheckout = ({ selectedCartItems }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div>
      <h3>Selected Cart Items</h3>
      <ul>
        {selectedCartItems.map(item => (
          <li key={item.productId}>
            <p onClick={() => handleProductClick(item.productId)} style={{ cursor: 'pointer' }}>Product ID: {item.productId}</p>
            <p>Name: {item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
            <p>Weight: {item.weight} g</p>
            <p>Warehouse IDs: {item.warehouseIds}</p>
            {item.primaryImageUrl && (
              <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} width="100" onClick={() => handleProductClick(item.productId)} style={{ cursor: 'pointer' }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItemListCheckout;
