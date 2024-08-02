import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryService from '../../services/InventoryService';
import ProductService from '../../services/ProductService';
import Select from 'react-select';

const AddProduct = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
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
          console.log(processedProducts);
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
      .then((response) => {
        alert('Product added to warehouse successfully!');
        navigate(`/warehouse/${warehouseId}/inventory`);
      })
      .catch((error) => {
        console.error('Error adding product to warehouse:', error);
        alert('Failed to add product to warehouse');
      });
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided, state) => ({
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
    <div>
      <h2>Add Product to Warehouse</h2>
      <form>
        <label>
          Select Product:
          <Select
            name="productId"
            value={options.find(option => option.value === newProduct.productId)}
            onChange={handleProductSelect}
            options={options}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
          />
        </label>
        <br />
        {selectedProduct && (
          <div>
            <h3>Selected Product Details</h3>
            <p><strong>Name:</strong> {selectedProduct.productName}</p>
            <p><strong>Description:</strong> {selectedProduct.descriptionDetails}</p>
            <img
              src={selectedProduct.primaryImage}
              alt={selectedProduct.productName}
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        )}
        <label>
          Quantity:
          <input type="text" name="quantity" value={newProduct.quantity} onChange={handleInputChange} />
        </label>
        {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity}</p>}
        <br />
        <button type="button" onClick={handleAddProduct}>Add Product</button>
      </form>
      <button onClick={() => navigate(`/warehouse/${warehouseId}`)}>Back to Warehouse</button>
    </div>
  );
};

export default AddProduct;