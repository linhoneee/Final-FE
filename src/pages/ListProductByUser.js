import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductService from '../services/ProductService';
import ProductDiscountService from '../services/ProductDiscountService'; // Import ProductDiscountService
import CartService from '../services/CartService';

const ListProductByUser = () => {
  const [products, setProducts] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const userID = useSelector(state => state.auth.userID);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.GetAllProductByUser()
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    ProductDiscountService.getAllProductDiscounts() // Gọi API để lấy danh sách giảm giá
      .then(response => {
        setProductDiscounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product discounts:', error);
      });
  }, []);

  const addToCart = (productId, name, quantity, price, warehouseIds, weight, primaryImageUrl) => {
    const discountedPrice = getDiscountedPrice(productId);
    const finalPrice = discountedPrice || price;
    const cartItem = { productId, name, quantity, price: finalPrice, warehouseIds, weight, primaryImageUrl };
    console.log('Cart item to add:', cartItem);
    CartService.AddCart(userID, cartItem)
      .then(response => {
        console.log('Product added to cart:', response.data);
        alert('Product added to cart successfully!');
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart');
      });
  };

  const getDiscountedPrice = (productId) => {
    const discount = productDiscounts.find(discount => discount.productId === productId);
    return discount ? discount.newPrice : null;
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        {products.map(productDTOuser => (
          <div key={productDTOuser.product.id} onClick={() => navigate(`/products/${productDTOuser.product.id}`)}>
            <h3>{productDTOuser.product.productName}</h3>
            {getDiscountedPrice(productDTOuser.product.id) ? (
              <p>
                Price: <span style={{ textDecoration: 'line-through' }}>${productDTOuser.product.price}</span> <span style={{ color: 'red' }}>${getDiscountedPrice(productDTOuser.product.id)}</span>
              </p>
            ) : (
              <p>Price: ${productDTOuser.product.price}</p>
            )}
            <p>Category: {productDTOuser.product.categoryId}</p>
            <p>Description: {productDTOuser.product.descriptionDetails}</p>
            <p>Weight: {productDTOuser.product.weight} g</p>
            {productDTOuser.primaryImage && (
              <img src={`http://localhost:6001${productDTOuser.primaryImage.url}`} alt="Primary" width="100" />
            )}
            <pre>{JSON.stringify(productDTOuser.product, null, 2)}</pre>
            <button onClick={(e) => {
              e.stopPropagation(); // Prevent the parent click handler from firing
              addToCart(
                productDTOuser.product.id,
                productDTOuser.product.productName,
                1,
                productDTOuser.product.price,
                productDTOuser.product.warehouseIds,
                productDTOuser.product.weight,
                productDTOuser.primaryImage ? productDTOuser.primaryImage.url : ''
              );
            }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProductByUser;
