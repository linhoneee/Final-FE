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
  const [selectedCategory, setSelectedCategory] = useState(null);  // Chỉ lưu 1 category
  const [selectedBrand, setSelectedBrand] = useState(null);  // Chỉ lưu 1 brand  
  const [sortOrder, setSortOrder] = useState('asc');  // Giá trị mặc định 'asc' (tăng dần)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
  const productsPerPage = 6;  // Số sản phẩm mỗi trang
  const userID = useSelector(state => state.auth.userID);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.GetProductsByFilters(searchTerm, selectedBrand ? [selectedBrand] : [], selectedCategory ? [selectedCategory] : [], sortOrder);
        setProducts(response.data);
        console.log("Dữ liệu lọc từ backend:", response.data);  
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };

    fetchProducts();

    ProductDiscountService.getAllProductDiscounts()
      .then(response => setProductDiscounts(response.data))
      .catch(error => console.error('Lỗi khi lấy danh sách giảm giá sản phẩm:', error));

    InventoryService.getAllInventory()
      .then(response => setInventory(response.data))
      .catch(error => console.error('Lỗi khi lấy thông tin kho hàng:', error));

    CategoryService.getAllCategories()
      .then(response => setCategories(response.data))
      .catch(error => console.error('Lỗi khi lấy danh mục:', error));

    BrandService.getAllBrands()
      .then(response => setBrands(response.data))
      .catch(error => console.error('Lỗi khi lấy danh sách thương hiệu:', error));

  }, [searchTerm, selectedCategory, selectedBrand, sortOrder]); 

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);  
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(prevSelected => {
      return prevSelected === categoryId ? null : categoryId;
    });
  };
  
  const handleBrandChange = (brandId) => {
    setSelectedBrand(prevSelected => {
      return prevSelected === brandId ? null : brandId;
    });
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

  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tính tổng số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

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
        <div className="filters-container">
          <div className="checkbox-filters">
            <h4>Danh mục</h4>
            {categories.map(category => (
              <div key={category.id}>
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id} 
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
                  checked={selectedBrand === brand.id}  
                  onChange={() => handleBrandChange(brand.id)}
                />
                <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {currentProducts.map(productDTOuser => {
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
                    Giá: <span className="original-price">${productDTOuser.product.price}</span> 
                    <span className="discounted-price">${getDiscountedPrice(productDTOuser.product.id)}</span>
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

        {/* Pagination */}
        <div className="pagination11">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            className="page-arrow11"
            disabled={currentPage === 1}
          >
            &#8592;
          </button>

          <span className="current-page11">
            {currentPage} / {pageNumbers.length}
          </span>

          <button
            onClick={() => paginate(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}
            className="page-arrow11"
            disabled={currentPage === pageNumbers.length}
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProductByUser;
