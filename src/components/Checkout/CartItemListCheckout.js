import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItemListCheckout.css'; // Import the new CSS file

const CartItemListCheckout = ({ selectedCartItems }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="cart-item-list-container">
      <h3>Selected Cart Items</h3>
      <ul>
        {selectedCartItems.map(item => (
          <li key={item.productId} className="cart-item">
            {item.primaryImageUrl && (
              <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} onClick={() => handleProductClick(item.productId)} />
            )}
            <div>
              <p onClick={() => handleProductClick(item.productId)} className="product-id">Product ID: {item.productId}</p>
              <p className="product-name">Name: {item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <p>Weight: {item.weight} g</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItemListCheckout;
