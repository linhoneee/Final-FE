import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentlyViewedProducts.css';

const RecentlyViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý index sản phẩm hiện tại
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    setViewedProducts(products.reverse()); // Đảo ngược danh sách sản phẩm để sản phẩm cuối cùng hiển thị đầu tiên
  }, []);

  // Điều hướng khi nhấn vào sản phẩm
  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  // Hàm để di chuyển sang phải
  const handleNext = () => {
    if (currentIndex < viewedProducts.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Hàm để di chuyển sang trái
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Giới hạn tối đa 4 sản phẩm
  const displayedProducts = viewedProducts.slice(currentIndex, currentIndex + 4);

  return (
    <div className="recently-viewed">
      <h2>Sản phẩm đã xem gần đây</h2>
      <div className="products-container">
        {/* Nút bấm trái */}
        <button
          className="scroll-button left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        {/* Danh sách sản phẩm */}
        <div className="products-list">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }} // Thêm con trỏ chuột để dễ nhận biết có thể click
            >
              <img src={`http://localhost:6001${product.imageUrl}`} alt={product.name} />
              <p>{product.name}</p>
              <p>{product.price} VND</p>
            </div>
          ))}
        </div>

        {/* Nút bấm phải */}
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
