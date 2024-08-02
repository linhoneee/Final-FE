import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductService from '../../services/ProductService';
import CartService from '../../services/CartService';
import Modal from 'react-modal';
import '../../Css/ImageModal.css'; // Import file CSS

Modal.setAppElement('#root'); // Đặt phần tử gốc cho react-modal

const ProductDetails = () => {
  const { id } = useParams(); // Lấy id của sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const userID = useSelector(state => state.auth.userID); // Lấy userID từ Redux store

  useEffect(() => {
    ProductService.GetProductById(id)
      .then(response => {
        setProduct(response.data.product);
        setImages(response.data.productImages);
        const primaryImg = response.data.productImages.find(image => image.isPrimary);
        setPrimaryImage(primaryImg);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const addToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.productName,
      quantity: 1,
      price: product.price,
      weight: product.weight,
      warehouseIds: product.warehouseIds,
      primaryImageUrl: primaryImage ? primaryImage.url : ''
    };
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

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>Error loading product details: {error.message}</p>;
  }

  return (
    <div>
      {product && (
        <>
          <h2>{product.productName}</h2>
          <p>Category: {product.categoryId}</p>
          <p>Description: {product.descriptionDetails}</p>
          <p>Price: ${product.price}</p>
          <p>Weight: {product.weight} g</p>
          <h3>Images</h3>
          <div>
            {images.map(image => (
              <img
                key={image.id}
                src={`http://localhost:6001${image.url}`}
                alt={`Product ${product.productName}`}
                width="100"
                onClick={() => openModal(image)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <button onClick={addToCart}>Add to Cart</button>
          <button onClick={() => navigate(-1)}>Back to Products</button>

          {selectedImage && (
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content">
              <img src={`http://localhost:6001${selectedImage.url}`} alt="Selected" />
              <button onClick={closeModal} className="modal-close-button">Close</button>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
