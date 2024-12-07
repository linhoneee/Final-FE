import React, { useEffect, useState } from 'react';
import './TopProducts.css';
import OrderService from '../services/OrderService';

const TopProducts = () => {
    const [topSellingProducts, setTopSellingProducts] = useState([]); // Khởi tạo là mảng rỗng

    useEffect( ()=>{
        OrderService.getTopProducts().then((response)=>{
            setTopSellingProducts(response.data);
            console.log(response.data)
  
        })

    },[]);

    return (
        <div className="top-products-container">
            <h2 className="top-products-title">Top 10 Sản Phẩm Bán Chạy Nhất</h2>
            <ul className="top-products-list">
                {topSellingProducts.map((product, index) => (
                    <li key={product.productId} className="top-product-item">
                        <span className="product-rank">#{index + 1}</span>
                        <span className="product-id"><strong>Tên: </strong>{product.productId}</span>

                        <span className="product-quantity">Đã bán: {product.quantitySold}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProducts;
