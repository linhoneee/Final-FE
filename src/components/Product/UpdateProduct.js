import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import './UpdateProduct.css'; // Import CSS file

const UpdateProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState('');
  const [descriptionDetails, setDescriptionDetails] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.GetProductById(id)
      .then((response) => {
        const productData = response.data.product;
        setProductName(productData.productName);
        setDescriptionDetails(productData.descriptionDetails);
        setPrice(productData.price);
        setWeight(productData.weight);
        const urls = response.data.productImages.map((img) => ({
          id: img.id,
          url: `http://localhost:6001${img.url}`, // Đảm bảo rằng URL này chính xác
          isPrimary: img.isPrimary // Add isPrimary property
        }));
        setImageUrls(urls);
      })
      .catch((err) => {
        console.error('There was an error fetching the product!', err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    const urls = files.map((file) => ({ id: null, url: URL.createObjectURL(file), isPrimary: false }));
    setImageUrls([...imageUrls, ...urls]);
  };

  const handleRemoveImage = (index) => {
    const removedImage = imageUrls[index];
    if (removedImage.id) {
      setDeletedImages([...deletedImages, removedImage.id]);
    }
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index || removedImage.id);

    setImageUrls(newImageUrls);
    setImageFiles(newImageFiles);
  };

  const setAsPrimaryImage = (index) => {
    const image = imageUrls[index];
    ProductService.SetPrimaryImage(id, image.id)
      .then(() => {
        const updatedImages = imageUrls.map((img, i) => ({
          ...img,
          isPrimary: i === index,
        }));
        setImageUrls(updatedImages);
      })
      .catch((err) => {
        console.error('There was an error setting the primary image!', err);
      });
  };

  const updateProductDetails = (e) => {
    e.preventDefault();
    const product = { productName, descriptionDetails, price, weight };
    ProductService.UpdateProduct(product, id)
      .then(() => {
        navigate('/productsadmin');
      })
      .catch((err) => {
        console.error('There was an error updating the product!', err);
      });
  };

  const updateProductImages = (e) => {
    e.preventDefault();
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const deleteRequests = deletedImages.map((imageId) => ProductService.DeleteProductImage(imageId));

    Promise.all(deleteRequests)
      .then(() => {
        return ProductService.UploadProductImages(id, formData);
      })
      .then((response) => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setImageFiles([]);
        setDeletedImages([]);
        const urls = response.data.productImages.map((img) => ({
          id: img.id,
          url: `http://localhost:6001/uploads/${img.url}`, // Đảm bảo rằng URL này chính xác
          isPrimary: img.isPrimary
        }));
        setImageUrls(urls);
      })
      .catch((err) => {
        console.error('There was an error updating the images!', err);
      });
  };

  return (
    <div className="update-product-container">
      <h2 className="update-product-header">Update Product</h2>
      <form className="update-product-form" onSubmit={updateProductDetails}>
        <div className="update-product-form-group">
          <label className="update-product-label">Product Name:</label>
          <input
            type="text"
            className="update-product-input"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Description:</label>
          <textarea
            className="update-product-textarea"
            value={descriptionDetails}
            onChange={(e) => setDescriptionDetails(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Price:</label>
          <input
            type="number"
            className="update-product-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Weight:</label>
          <input
            type="number"
            className="update-product-input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button type="submit" className="update-product-button">Update Product Details</button>
      </form>

      <h2 className="update-product-header">Update Product Images</h2>
      <form className="update-product-form" onSubmit={updateProductImages}>
        <div className="update-product-form-group">
          <label className="update-product-label">Images:</label>
          <div className="update-product-images">
            {imageUrls.map((image, index) => (
              <div key={index} className="update-product-image-container">
                <img src={image.url} alt={`Product ${index + 1}`} className="update-product-image" />
                <button type="button" className="update-product-button update-product-remove-button" onClick={() => handleRemoveImage(index)}>Remove</button>
                <button type="button" className="update-product-button update-product-primary-button" onClick={() => setAsPrimaryImage(index)}>
                  {image.isPrimary ? 'Primary' : 'Set as Primary'}
                </button>
              </div>
            ))}
          </div>
          <label className="update-product-file-label" htmlFor="file-input">Choose Files</label>
          <input
            id="file-input"
            type="file"
            multiple
            className="update-product-file-input"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
        <button type="submit" className="update-product-button">Update Product Images</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
