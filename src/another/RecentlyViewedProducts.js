import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import './RecentlyViewedProducts.css';

const RecentlyViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState([]);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    setViewedProducts(products);
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`); // Điều hướng đến đường dẫn /products/id
  };

  return (
    <div className="recently-viewed">
      <h2>Recently Viewed Products</h2>
      <div className="products-list">
        {viewedProducts.map(product => (
          <div
            key={product.id}
            className="product-item"
            onClick={() => handleProductClick(product.id)} 
            style={{ cursor: 'pointer' }} // Thêm con trỏ chuột để dễ nhận biết có thể click
          >
            <img src={`http://localhost:6001${product.imageUrl}`} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
