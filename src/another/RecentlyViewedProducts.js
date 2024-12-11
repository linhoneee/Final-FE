import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentlyViewedProducts.css';

const RecentlyViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const navigate = useNavigate();    

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    setViewedProducts(products.reverse()); 
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleNext = () => {
    if (currentIndex + 4 < viewedProducts.length) {
      setCurrentIndex(currentIndex + 4); 
    }
  };

  const handlePrev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4); 
    }
  };

  const displayedProducts = viewedProducts.slice(currentIndex, currentIndex + 4);

  return (
    <div className="recently-viewed">
      <h2>Sản phẩm đã xem gần đây</h2>
      <div className="products-container">
        <button
          className="scroll-button left"
          onClick={handlePrev}
          disabled={currentIndex === 0} 
        >
          &lt; 
          {/* dấu < */}
        </button>

        <div className="products-list">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }} 
            >
              <img src={`http://localhost:6001${product.imageUrl}`} alt={product.name} />
              <p>{product.name}</p>
              <p>${product.price}</p>
            </div>
          ))}
        </div>

        <button
          className="scroll-button right"
          onClick={handleNext}
          disabled={currentIndex + 4 >= viewedProducts.length} 
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
