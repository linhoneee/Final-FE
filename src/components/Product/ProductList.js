import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import ProductDiscountService from "../../services/ProductDiscountService";
import InventoryService from "../../services/InventoryService"; // Import InventoryService
import AddProductDiscount from "../DiscountAndPromotion/AddProductDiscount";
import EditProductDiscount from "../DiscountAndPromotion/EditProductDiscount";
import { useNavigate } from "react-router-dom";
import './ProductList.css'; // Import CSS file
import AddProduct from "./AddProduct";
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function

const ProductList = () => {
  const [products, setProducts] = useState([]);  // To store the full product list
  const [filteredProducts, setFilteredProducts] = useState([]);  // To store the filtered product list based on search query
  const [images, setImages] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // New state for the search query

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter products based on searchQuery
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);  // Re-run the filtering whenever products or searchQuery change

  const fetchData = () => {
    ProductService.GetAllProduct().then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data);  // Initialize filtered products
      console.log("Products:", response.data);
    }).catch(err => {
      console.error("Error fetching products:", err);
    });

    ProductService.GetAllProductImages().then((response) => {
      setImages(response.data);
      console.log("Images:", response.data);
    }).catch(err => {
      console.error("Error fetching product images:", err);
    });

    ProductDiscountService.getAllProductDiscounts().then((response) => {
      setProductDiscounts(response.data);
      console.log("Product Discounts:", response.data);
    }).catch(err => {
      console.error("Error fetching product discounts:", err);
    });

    InventoryService.getAllInventory().then((response) => {
      setInventory(response.data);
      console.log("Inventory:", response.data);
    }).catch(err => {
      console.error("Error fetching inventory:", err);
    });
  };

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (confirmDelete) {
      ProductService.DeleteProduct(id)
        .then(() => {
          // Cập nhật lại danh sách sản phẩm và hình ảnh sau khi xóa
          setProducts(products.filter((product) => product.id !== id));
          setImages(images.filter((image) => image.productId !== id));
  
          // Hiển thị thông báo thành công
          showGeneralToast("Sản phẩm đã được xóa thành công!", "success");
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
  
          // Hiển thị thông báo lỗi nếu có
          if (err.response && err.response.data) {
            const { message } = err.response.data;
            showGeneralToast(message, "error");
          } else {
            showGeneralToast("Có lỗi xảy ra khi xóa sản phẩm", "error");
          }
        });
    }
  };

  const updateProduct = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const getProductImages = (productId) => {
    return images.filter(image => image.productId === productId).map(image => ({
      ...image,
      url: `http://localhost:6001${image.url}`
    }));
  };

  const getDiscountedPrice = (productId) => {
    const discount = productDiscounts.find(discount => discount.productId === productId);
    return discount ? discount.newPrice : null;
  };

  const openAddModal = (product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedProduct(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const deleteDiscount = (productId) => {
    const discount = productDiscounts.find(discount => discount.productId === productId);
    if (discount) {
      const confirmDelete = window.confirm("Bạn có chắc muốn xóa giảm giá này?");
      if (confirmDelete) {
        ProductDiscountService.deleteProductDiscount(discount.id)
          .then(() => {
            // Cập nhật lại danh sách sản phẩm giảm giá sau khi xóa
            setProductDiscounts(productDiscounts.filter(d => d.id !== discount.id));
  
            // Hiển thị thông báo thành công
            showGeneralToast("Giảm giá đã được xóa thành công!", "success");
          })
          .catch((err) => {
            console.error("Error deleting product discount:", err);
  
            // Hiển thị thông báo lỗi nếu có
            if (err.response && err.response.data) {
              const { message } = err.response.data;
              showGeneralToast(message, "error");
            } else {
              showGeneralToast("Có lỗi xảy ra khi xóa giảm giá", "error");
            }
          });
      }
    }
  };

  const checkStockForProduct = (productId) => {
    const productInventory = inventory.filter(item => item.productId === productId);
    const totalQuantity = productInventory.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity > 0;
  };

  const refreshProductList = () => {
    fetchData(); // Gọi lại API để lấy danh sách sản phẩm mới
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-header">Danh Sách Sản Phẩm</h1>
      

      <button onClick={() => setShowAddProductModal(true)} className="category-list-btn category-list-btn-primary">Thêm sản phẩm</button>

      {/* Tìm kiếm sản phẩm */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm theo tên..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}  // Cập nhật trạng thái searchQuery
        className="search-input-admin"
      />


      <table className="product-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Giá gốc</th>
            <th>Giá giảm</th>
            <th>Cân nặng</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => {
            const inStock = checkStockForProduct(product.id);
            return (
              <tr key={product.id} style={{ backgroundColor: inStock ? 'white' : 'lightgrey' }}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>{product.descriptionDetails}</td>
                <td>
                  {getDiscountedPrice(product.id) ? (
                    <span style={{ textDecoration: 'line-through' }}>${product.price}</span>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </td>
                <td>
                  {getDiscountedPrice(product.id) ? (
                    <span style={{ color: 'red' }}>${getDiscountedPrice(product.id)}</span>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td>{product.weight}</td>
                <td className="product-list-images">
                  {getProductImages(product.id).map((image, index) => (
                    <img 
                      key={index} 
                      src={image.url} 
                      alt={product.productName} 
                      onClick={() => openImageModal(image)}
                    />
                  ))}
                </td>
                <td className="product-list-actions">
                  <button onClick={() => deleteProduct(product.id)} className="product-list-button product-list-button-danger">Xóa</button>
                  <button onClick={() => updateProduct(product.id)} className="product-list-button product-list-button-info">Cập Nhật</button>
                  {!getDiscountedPrice(product.id) ? (
                    <button onClick={() => openAddModal(product)} className="product-list-button product-list-button-primary">Thêm Giảm Giá</button>
                  ) : (
                    <>
                      <button onClick={() => openEditModal(product)} className="product-list-button product-list-button-info">Chỉnh Sửa Giảm Giá</button>
                      <button onClick={() => deleteDiscount(product.id)} className="product-list-button product-list-button-danger">Xóa Giảm Giá</button>
                    </>
                  )}
                  {!inStock && <p style={{ color: 'red' }}>Sản phẩm đã hết hàng</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showAddProductModal && <AddProduct onClose={() => setShowAddProductModal(false)} refreshProductList={refreshProductList} />}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddProductDiscount
              product={selectedProduct}
              closeModal={closeAddModal}
              setProductDiscounts={setProductDiscounts}
              productDiscounts={productDiscounts}
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditProductDiscount
              product={selectedProduct}
              closeModal={closeEditModal}
              setProductDiscounts={setProductDiscounts}
              productDiscounts={productDiscounts}
            />
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content">
            <img src={selectedImage.url} alt={selectedImage.productName} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
