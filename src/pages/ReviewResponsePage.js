import React, { useEffect, useState } from 'react';
import ReviewService from '../services/ReviewService';
import ProductService from '../services/ProductService';
import Modal from 'react-modal';
import './ReviewResponsePage.css';
import { useSelector } from 'react-redux';

const ReviewResponsePage = () => {
    const [reviewsWithProducts, setReviewsWithProducts] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [response, setResponse] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userID = useSelector(state => state.auth.userID);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchReviewsWithProducts();
    }, []);

    const fetchReviewsWithProducts = async () => {
        setIsLoading(true);
        try {
            const reviewResponse = await ReviewService.getReviewsWithoutResponses();
            const reviews = reviewResponse.data;

            const reviewsWithProducts = await Promise.all(
                reviews.map(async (review) => {
                    try {
                        const productResponse = await ProductService.GetProductById(review.productId);
                        const product = productResponse.data?.product || {};
                        const productImages = productResponse.data?.productImages || [];
                        const productImage = productImages.find(img => img.isPrimary)?.url || '/default-product.jpg';

                        return {
                            ...review,
                            productName: product.productName || 'Unknown Product',
                            productPrice: product.price || 0,
                            productImage,
                        };
                    } catch (error) {
                        console.error(`Failed to fetch product for review ${review.id}`, error);
                        return { ...review, productName: 'Unknown Product', productPrice: null, productImage: '/default-product.jpg' };
                    }
                })
            );

            setReviewsWithProducts(reviewsWithProducts);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setIsLoading(false);
        }
    };

    const openModal = (review) => {
        if (!review) {
            console.error("No review selected.");
            return;
        }
        setSelectedReview(review);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedReview(null);
        setResponse('');
        setErrorMessage('');
        setModalIsOpen(false);
    };

    const submitResponse = () => {
        if (!response.trim()) {
            setErrorMessage('Response cannot be empty. Please write your response.');
            return;
        }

        if (selectedReview) {
            const newResponse = {
                productId: selectedReview.productId,
                userId: userID,
                rating: 0,
                comment: response,
                parentId: selectedReview.id,
            };
            ReviewService.addReview(newResponse)
                .then(() => {
                    alert('Response added successfully!');
                    fetchReviewsWithProducts();
                    closeModal();
                })
                .catch(error => {
                    console.error('Error adding response:', error);
                    setErrorMessage('Failed to submit response. Please try again.');
                });
        }
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        const stars = [];

        for (let i = 0; i < totalStars; i++) {
            if (i < rating) {
                stars.push(<span key={i} className="star gold-star">★</span>);
            } else {
                stars.push(<span key={i} className="star silver-star">★</span>);
            }
        }
        return stars;
    };

    return (
        <div className="review-response-page">
            <h2>Reviews Without Responses</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : reviewsWithProducts.length === 0 ? (
                <p>No reviews without responses.</p>
            ) : (
                <div className="review-list">
                    {reviewsWithProducts.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="product-info">
                                <img
                                    src={review.productImage.startsWith('http') ? review.productImage : `http://localhost:6001${review.productImage}`}
                                    alt={review.productName}
                                    className="product-image"
                                    onError={(e) => { e.target.src = '/default-product.jpg'; }}
                                />
                                <div>
                                    <p><strong>{review.productName}</strong></p>
                                    <p>Price: ${review.productPrice}</p>
                                </div>
                            </div>
                            <p>
                                <strong>Rating:</strong> 
                                <span className="stars">{renderStars(review.rating)}</span>
                            </p>
                            <p><strong>Review:</strong> {review.comment}</p>
                            <button onClick={() => openModal(review)}>Respond</button>
                        </div>
                    ))}
                </div>
            )}

            {selectedReview && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="review-response-modal-content"
                    overlayClassName="review-response-modal-overlay"
                >
                    <h3>Respond to Review</h3>
                    <div className="modal-product-info">
                        <img
                            src={
                                selectedReview.productImage.startsWith('http')
                                    ? selectedReview.productImage
                                    : `http://localhost:6001${selectedReview.productImage}`
                            }
                            alt={selectedReview.productName}
                            className="modal-product-image"
                        />
                        <div>
                            <p><strong>{selectedReview.productName}</strong></p>
                            <p>Price: ${selectedReview.productPrice}</p>
                            <p>
                                <strong>Rating:</strong> 
                                <span className="stars">{renderStars(selectedReview.rating)}</span>
                            </p>
                        </div>
                    </div>
                    <h2>
                        <strong style={{ color: 'red' }}>Review:</strong> {selectedReview.comment}
                    </h2>
                    <textarea
                        value={response}
                        onChange={(e) => {
                            setResponse(e.target.value);
                            setErrorMessage('');
                        }}
                        placeholder="Write your response..."
                    ></textarea>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button onClick={submitResponse}>Submit Response</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            )}
        </div>
    );
};

export default ReviewResponsePage;
