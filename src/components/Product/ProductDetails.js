import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductService from '../../services/ProductService';
import ReviewService from '../../services/ReviewService';
import CartService from '../../services/CartService';
import Modal from 'react-modal';
import '../../Css/ProductDetails.css'; // Import the new CSS file

Modal.setAppElement('#root'); // Set the root element for react-modal

const ProductDetails = () => {
  const { id } = useParams(); // Get product id from URL
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const userID = useSelector(state => state.auth.userID); // Get userID from Redux store

  useEffect(() => {
    // Fetch product details
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

    // Fetch product reviews
    ReviewService.getReviewsByProductId(id)
      .then(response => {
        setReviews(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={`star_${index}`} className={index < rating ? 'filled' : ''}>★</span>
    ));
  };

  const renderReviews = (reviews) => {
    const reviewMap = {};
    const rootReviews = [];

    // Create map and classify reviews/responses
    reviews.forEach(review => {
      reviewMap[review.review.id] = { ...review, responses: [] };
      if (review.review.parentId === null) {
        rootReviews.push(reviewMap[review.review.id]);
      } else if (reviewMap[review.review.parentId]) {
        reviewMap[review.review.parentId].responses.push(reviewMap[review.review.id]);
      }
    });

    // Render reviews and responses
    const renderReviewItem = (review, isResponse = false) => (
      <div key={review.review.id} className={`review ${isResponse ? 'response' : ''}`}>
        <div className="review-header">
          <img src={`http://localhost:6001${review.user.picture}`} alt="User Avatar" />
          <p><strong>{review.user.username}</strong> ({review.user.email})</p>
        </div>
        <div className="review-body">
          {review.review.parentId === null && (
            <div className="star-rating">
              {renderStars(review.review.rating)}
            </div>
          )}
          <div className="comment">
            <span><strong>Comment:</strong> {review.review.comment}</span>
            <span className="date"><strong>Date:</strong> {new Date(review.review.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {review.responses.map(response => renderReviewItem(response, true))}
      </div>
    );

    return rootReviews.map(review => renderReviewItem(review));
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>Error loading product details: {error.message}</p>;
  }

  return (
    <div className="product-details-container">
      {product && (
        <>
          <h2>{product.productName}</h2>
          <p>Category: {product.categoryId}</p>
          <p>Description: {product.descriptionDetails}</p>
          <p>Price: ${product.price}</p>
          <p>Weight: {product.weight} g</p>
          <h3>Images</h3>
          <div className="product-images">
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

          <h3>Reviews</h3>
          <div className="review-container">
            {reviews.length > 0 ? (
              renderReviews(reviews)
            ) : (
              <p>No reviews found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
