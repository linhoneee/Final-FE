import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductService from '../services/ProductService';
import ProductDiscountService from '../services/ProductDiscountService';
import CartService from '../services/CartService';
import InventoryService from '../services/InventoryService';
import CategoryService from '../services/CategoryService';
import BrandService from '../services/BrandService';
import './ListProductByUser.css';
import showGeneralToast from '../components/toastUtils/showGeneralToast'; // Import toast

const ListProductByUser = () => {
  const [products, setProducts] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');  // Giá trị mặc định 'asc' (tăng dần)
  const [searchTerm, setSearchTerm] = useState('');
  const userID = useSelector(state => state.auth.userID);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm với bộ lọc từ backend
    const fetchProducts = async () => {
      try {
        const response = await ProductService.GetProductsByFilters(searchTerm, selectedBrands, selectedCategories, sortOrder);
        setProducts(response.data);
        console.log("Dữ liệu lọc từ backend:", response.data);  // Log dữ liệu từ backend
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };

    fetchProducts();

    // Lấy thông tin giảm giá sản phẩm
    ProductDiscountService.getAllProductDiscounts()
      .then(response => setProductDiscounts(response.data))
      .catch(error => console.error('Lỗi khi lấy danh sách giảm giá sản phẩm:', error));

    // Lấy thông tin kho hàng
    InventoryService.getAllInventory()
      .then(response => setInventory(response.data))
      .catch(error => console.error('Lỗi khi lấy thông tin kho hàng:', error));

    // Lấy danh mục
    CategoryService.getAllCategories()
      .then(response => setCategories(response.data))
      .catch(error => console.error('Lỗi khi lấy danh mục:', error));

    // Lấy thương hiệu
    BrandService.getAllBrands()
      .then(response => setBrands(response.data))
      .catch(error => console.error('Lỗi khi lấy danh sách thương hiệu:', error));

  }, [searchTerm, selectedCategories, selectedBrands, sortOrder]);  // Mỗi khi thay đổi bộ lọc, sẽ gọi lại API

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);  // Cập nhật giá trị sortOrder khi người dùng thay đổi
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
        showGeneralToast('Sản phẩm đã được thêm vào giỏ hàng thành công!', 'success');
      })
      .catch(error => {
        showGeneralToast('Thêm sản phẩm vào giỏ hàng thất bại', 'error');
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
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

  return (
    <div className="list-product-container">
      <h2 className="list-product-header">Sản phẩm</h2>

      <div className="top-filters-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={sortOrder} onChange={handleSortChange} className="sort-select">
          <option value="asc">Giá: Từ thấp đến cao</option>
          <option value="desc">Giá: Từ cao đến thấp</option>
        </select>
      </div>

      <div className="main-content">
        <div className="checkbox-filters">
          <h4>Danh mục</h4>
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
          <h4>Thương hiệu</h4>
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
          {products.map(productDTOuser => {
            const inStock = checkStockForProduct(productDTOuser.product.id);
            return (
              <div
                key={productDTOuser.product.id}
                className={`product-card ${inStock ? '' : 'out-of-stock'}`}
                onClick={() => navigate(`/products/${productDTOuser.product.id}`)}
              >
                {productDTOuser.primaryImage && (
                  <img
                    src={`http://localhost:6001${productDTOuser.primaryImage.url}`}
                    alt="Primary"
                    className="image"
                  />
                )}
                <h3 className="product-name">{productDTOuser.product.productName}</h3>
                {getDiscountedPrice(productDTOuser.product.id) ? (
                  <p className="product-price">
                    Giá: <span className="original-price">${productDTOuser.product.price}</span> <span className="discounted-price">${getDiscountedPrice(productDTOuser.product.id)}</span>
                  </p>
                ) : (
                  <p className="product-price">Giá: ${productDTOuser.product.price}</p>
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
                  Thêm vào giỏ hàng
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
