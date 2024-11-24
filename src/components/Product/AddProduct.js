import React, { useState, useRef } from 'react';
import ProductService from '../../services/ProductService';
import './AddProduct.css'; // Import CSS file

const AddProduct = ({ onClose }) => {
  const [productName, setProductName] = useState('');
  const [descriptionDetails, setDescriptionDetails] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);

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

    ProductService.CreateProduct(product)
      .then((response) => {
        const productId = response.data.id;
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        ProductService.UploadProductImages(productId, formData)
          .then(() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setImageFiles([]);
            onClose(); // Close modal after save
          })
          .catch((err) => {
            console.error('There was an error uploading the images!', err);
          });
      })
      .catch((err) => {
        console.error('There was an error creating the product!', err);
      });
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-modal-content">
        <h2 className="add-product-modal-title">Add Product</h2>
        <form className="add-product-form" onSubmit={saveProduct}>
          <div className="add-product-form-group">
            <label className="add-product-label">Product Name:</label>
            <input
              type="text"
              className="add-product-input"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Description:</label>
            <textarea
              className="add-product-textarea"
              value={descriptionDetails}
              onChange={(e) => setDescriptionDetails(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Price:</label>
            <input
              type="number"
              className="add-product-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Weight:</label>
            <input
              type="number"
              className="add-product-input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Images:</label>
            <div className="add-product-images">
              {imageUrls.map((image, index) => (
                <div key={index} className="add-product-image-container">
                  <img src={image.url} alt={`Product ${index + 1}`} className="add-product-image" />
                  <button type="button" className="add-product-remove-button" onClick={() => handleRemoveImage(index)}>X</button>
                </div>
              ))}
            </div>
            <label className="add-product-file-label" htmlFor="file-input">Choose Files</label>
            <input
              id="file-input"
              type="file"
              multiple
              className="add-product-file-input"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>
          <button type="submit" className="add-product-button add-product-button-primary">Save</button>
          <button type="button" onClick={onClose} className="add-product-button add-product-button-danger">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
