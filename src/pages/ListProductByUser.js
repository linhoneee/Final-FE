import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductService from '../services/ProductService';
import ProductDiscountService from '../services/ProductDiscountService'; // Import ProductDiscountService
import CartService from '../services/CartService';
import InventoryService from '../services/InventoryService'; // Import InventoryService
import CategoryService from '../services/CategoryService'; // Import CategoryService
import BrandService from '../services/BrandService'; // Import BrandService
import './ListProductByUser.css'; // Import CSS file

const ListProductByUser = () => {
  const [products, setProducts] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [searchTerm, setSearchTerm] = useState('');
  const userID = useSelector(state => state.auth.userID);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.GetAllProductByUser()
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    ProductDiscountService.getAllProductDiscounts()
      .then(response => {
        setProductDiscounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product discounts:', error);
      });

    InventoryService.getAllInventory()
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });

    CategoryService.getAllCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    BrandService.getAllBrands()
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prevSelected => 
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands(prevSelected => 
      prevSelected.includes(brandId)
        ? prevSelected.filter(id => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  const addToCart = (productId, name, quantity, price, warehouseIds, weight, primaryImageUrl) => {
    const discountedPrice = getDiscountedPrice(productId);
    const finalPrice = discountedPrice || price;
    const cartItem = { productId, name, quantity, price: finalPrice, warehouseIds, weight, primaryImageUrl };
    CartService.AddCart(userID, cartItem)
      .then(response => {
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

  const checkStockForProduct = (productId) => {
    const productInventory = inventory.filter(item => item.productId === productId);
    const totalQuantity = productInventory.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity > 0;
  };

  const filteredProducts = products
    .filter(productDTOuser => 
      productDTOuser.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(productDTOuser.product.categoryId)) &&
      (selectedBrands.length === 0 || selectedBrands.includes(productDTOuser.product.brandId))
    )
    .sort((a, b) => 
      sortOrder === 'lowToHigh' 
        ? a.product.price - b.product.price 
        : b.product.price - a.product.price
    );

  return (
    <div className="list-product-container">
      <h2 className="list-product-header">Products</h2>

      <div className="top-filters-container">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="search-input"
        />
        <select value={sortOrder} onChange={handleSortChange} className="sort-select">
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="main-content">
        <div className="checkbox-filters">
          <h4>Categories</h4>
          {categories.map(category => (
            <div key={category.id}>
              <input 
                type="checkbox" 
                id={`category-${category.id}`} 
                checked={selectedCategories.includes(category.id)} 
                onChange={() => handleCategoryChange(category.id)} 
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
          <h4>Brands</h4>
          {brands.map(brand => (
            <div key={brand.id}>
              <input 
                type="checkbox" 
                id={`brand-${brand.id}`} 
                checked={selectedBrands.includes(brand.id)} 
                onChange={() => handleBrandChange(brand.id)} 
              />
              <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
            </div>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(productDTOuser => {
            const inStock = checkStockForProduct(productDTOuser.product.id);
            return (
              <div 
                key={productDTOuser.product.id} 
                className={`product-card ${inStock ? '' : 'out-of-stock'}`}
                onClick={() => navigate(`/products/${productDTOuser.product.id}`)}
              >
                   {productDTOuser.primaryImage && (
                  <img src={`http://localhost:6001${productDTOuser.primaryImage.url}`} alt="Primary" className="image" />
                )}
                <h3 className="product-name">{productDTOuser.product.productName}</h3>
                {getDiscountedPrice(productDTOuser.product.id) ? (
                  <p className="product-price">
                    Price: <span className="original-price">${productDTOuser.product.price}</span> <span className="discounted-price">${getDiscountedPrice(productDTOuser.product.id)}</span>
                  </p>
                ) : (
                  <p className="product-price">Price: ${productDTOuser.product.price}</p>
                )}
             
                {!inStock && <p className="out-of-stock-text">Sản phẩm đã hết hàng</p>}
                <button 
                  className="add-to-cart-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(
                      productDTOuser.product.id,
                      productDTOuser.product.productName,
                      1,
                      productDTOuser.product.price,
                      productDTOuser.product.warehouseIds,
                      productDTOuser.product.weight,
                      productDTOuser.primaryImage ? productDTOuser.primaryImage.url : ''
                    );
                  }} 
                  disabled={!inStock}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListProductByUser;
