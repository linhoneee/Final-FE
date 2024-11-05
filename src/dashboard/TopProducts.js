import React from 'react';
import './TopProducts.css';

const TopProducts = () => {
    // Thêm dữ liệu trực tiếp vào component
    const topSellingProducts = [
        { productId: 1, quantitySold: 39 },
        { productId: 2, quantitySold: 26 },
        { productId: 3, quantitySold: 19 },
        { productId: 4, quantitySold: 17 },
        { productId: 5, quantitySold: 13 },
        { productId: 6, quantitySold: 9 },
        { productId: 3, quantitySold: 19 },
        { productId: 4, quantitySold: 17 },
        { productId: 5, quantitySold: 13 },
        { productId: 6, quantitySold: 9 }
    ];

    return (
        <div className="top-products-container">
            <h2 className="top-products-title">Top 10 Sản Phẩm Bán Chạy Nhất</h2>
            <ul className="top-products-list">
                {topSellingProducts.map((product, index) => (
                    <li key={product.productId} className="top-product-item">
                        <span className="product-rank">#{index + 1}</span>
                        <span className="product-id">Mã sản phẩm: {product.productId}</span>
                        <span className="product-quantity">Đã bán: {product.quantitySold}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProducts;
