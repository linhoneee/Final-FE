import React, { useEffect, useState } from 'react';
import './TopProducts.css';
import OrderService from '../services/OrderService';
import ProductService from '../services/ProductService'; // Import ProductService

const TopProducts = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]); // Khởi tạo là mảng rỗng
  const [productNames, setProductNames] = useState({}); // Lưu trữ tên sản phẩm theo productId

  useEffect(() => {
    // Bước 1: Lấy danh sách các sản phẩm bán chạy
    OrderService.getTopProducts().then((response) => {
      const products = response.data;

      // Bước 2: Gọi API để lấy tên của từng sản phẩm
      const productIdList = products.map(product => product.productId);

      // Gọi API để lấy tên sản phẩm cho tất cả productId
      const fetchProductNames = productIdList.map(id => 
        ProductService.GetProductById(id)
          .then((productResponse) => {
            return { 
              productId: id, 
              name: productResponse.data.product.productName 
            };
          })
          .catch(error => {
            console.error('Error fetching product name:', error);
            return null;
          })
      );

      // Bước 3: Sau khi lấy tất cả tên sản phẩm, lưu vào state
      Promise.all(fetchProductNames)
        .then((names) => {
          const namesMap = names.filter(item => item !== null).reduce((acc, { productId, name }) => {
            acc[productId] = name;
            return acc;
          }, {});

          setProductNames(namesMap); // Lưu tên sản phẩm vào state
          setTopSellingProducts(products); // Lưu danh sách sản phẩm vào state
        });
    }).catch((error) => {
      console.error('Error fetching top selling products:', error);
    });
  }, []); // useEffect chỉ chạy 1 lần khi component mount

  return (
    <div className="top-products-container">
      <h2 className="top-products-title">Top 10 Sản Phẩm Bán Chạy Nhất</h2>
      <ul className="top-products-list">
        {topSellingProducts.map((product, index) => (
          <li key={product.productId} className="top-product-item">
            <span className="product-rank">#{index + 1}</span>
            <span className="product-name">
              <strong>Tên: </strong>{productNames[product.productId] || 'Đang tải...'}
            </span>
            <span className="product-quantity">Đã bán: {product.quantitySold}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;
