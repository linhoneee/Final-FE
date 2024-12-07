import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import InventoryService from '../../services/InventoryService';
import Select from 'react-select';
import './AddProductModal.css';

const AddProductModal = ({ warehouseId, closeModal }) => {
  const [newProduct, setNewProduct] = useState({
    productId: '',
    quantity: '',
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    ProductService.GetAllProductByUser()
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          const processedProducts = response.data.map(product => ({
            ...product,
            product: {
              ...product.product,
              primaryImage: product.primaryImage
                ? `http://localhost:6001${product.primaryImage.url}`
                : 'http://localhost:6001/placeholder.png'
            }
          }));
          setProducts(processedProducts);
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleProductSelect = (selectedOption) => {
    const productId = selectedOption.value;
    const product = products.find(p => p.product && p.product.id === parseInt(productId));
    setNewProduct({ ...newProduct, productId });

    if (product) {
      setSelectedProduct({
        ...product.product,
      });
    } else {
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = () => {
    let validationErrors = {};
    if (!newProduct.quantity) {
      validationErrors.quantity = 'Quantity is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const product = {
      ...newProduct,
      warehouseId,
      updatedAt: new Date().toISOString(),
    };

    InventoryService.addProductToWarehouse(warehouseId, product)
      .then(() => {
        closeModal(); 
      })
      .catch((error) => {
        console.error('Error adding product to warehouse:', error);
      });
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ value, label, product }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={product.primaryImage}
        alt={product.productName}
        style={{ width: '50px', height: '50px', marginRight: '10px' }}
      />
      <div>
        <div>{product.productName}</div>
        <div style={{ fontSize: '12px', color: '#777' }}>{product.descriptionDetails}</div>
      </div>
    </div>
  );

  const options = products.map(product => ({
    value: product.product.id,
    label: product.product.productName,
    product: product.product,
  }));

  return (
    <div className="add-product-modal-container">
      <div className="add-product-modal-content">
        <h2 className="add-product-modal-header">Thêm Sản Phẩm Vào Kho</h2>
        <form className="add-product-modal-form">
          <label className="add-product-modal-label">
            Chọn Sản Phẩm:
            <Select
              name="productId"
              value={options.find(option => option.value === newProduct.productId)}
              onChange={handleProductSelect}
              options={options}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              className="add-product-modal-select"
            />
          </label>
          {selectedProduct && (
            <div className="add-product-modal-selected-product">
              <h3>Chi Tiết Sản Phẩm Đã Chọn</h3>
              <p><strong>Tên:</strong> {selectedProduct.productName}</p>
              <p><strong>Mô Tả:</strong> {selectedProduct.descriptionDetails}</p>
              <img
                src={selectedProduct.primaryImage}
                alt={selectedProduct.productName}
                className="add-product-modal-image"
              />
            </div>
          )}
          <label className="add-product-modal-label">
            Số Lượng:
            <input type="text" name="quantity" value={newProduct.quantity} onChange={handleInputChange} className="add-product-modal-input" />
          </label>
          {errors.quantity && <p className="add-product-modal-error">{errors.quantity}</p>}
          <div className="add-product-modal-buttons">
            <button type="button" onClick={handleAddProduct} className="add-product-modal-button add-product-modal-button-primary">Thêm Sản Phẩm</button>
            <button type="button" onClick={closeModal} className="add-product-modal-button add-product-modal-button-secondary">Hủy Bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default AddProductModal;
