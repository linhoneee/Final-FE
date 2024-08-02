import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [descriptionDetails, setDescriptionDetails] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    const urls = files.map((file) => ({ url: URL.createObjectURL(file) }));
    setImageUrls([...imageUrls, ...urls]);
  };

  const handleRemoveImage = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);

    setImageUrls(newImageUrls);
    setImageFiles(newImageFiles);
  };

  const saveProduct = (e) => {
    e.preventDefault();
    const product = { productName, descriptionDetails, price, weight };

    ProductService.CreateProduct(product).then((response) => {
      const productId = response.data.id;
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      ProductService.UploadProductImages(productId, formData).then(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setImageFiles([]);
        navigate('/productsadmin');
      }).catch(err => {
        console.error('There was an error uploading the images!', err);
      });
    }).catch(err => {
      console.error('There was an error creating the product!', err);
    });
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={saveProduct}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={descriptionDetails}
            onChange={(e) => setDescriptionDetails(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label>Images:</label>
          {imageUrls.map((image, index) => (
            <div key={index}>
              <img src={image.url} alt={`Product ${index + 1}`} width="50" />
              <button type="button" onClick={() => handleRemoveImage(index)}>X</button>
            </div>
          ))}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddProduct;
