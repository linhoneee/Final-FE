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
      <h3>Sản Phẩm Đã Chọn</h3>
      <ul>
        {selectedCartItems.map(item => (
          <li key={item.productId} className="cart-item">
            {item.primaryImageUrl && (
              <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} onClick={() => handleProductClick(item.productId)} />
            )}
            <div>
              <p onClick={() => handleProductClick(item.productId)} className="product-id"></p>
              <p className="product-name">Tên: {item.name}</p>
              <p>Số Lượng: {item.quantity}</p>
              <p>Giá: ${item.price}</p>
              <p>Khối Lượng: {item.weight} g</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItemListCheckout;
