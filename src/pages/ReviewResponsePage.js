import React, { useEffect, useState } from 'react';
import ReviewService from '../services/ReviewService';
import ProductService from '../services/ProductService';
import Modal from 'react-modal';
import './ReviewResponsePage.css';
import { useSelector } from 'react-redux';
import showGeneralToast from '../components/toastUtils/showGeneralToast'; // Import toast function

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
        // Kiểm tra nếu phản hồi trống
        if (!response.trim()) {
            setErrorMessage('Response cannot be empty. Please write your response.');
            return;
        }
    
        // Nếu có review được chọn
        if (selectedReview) {
            const newResponse = {
                productId: selectedReview.productId,
                userId: userID,
                rating: 0,
                comment: response,
                parentId: selectedReview.id,
            };
    
            // Gọi API để thêm phản hồi
            ReviewService.addReview(newResponse)
                .then(() => {
                    // Hiển thị thông báo thành công
                    showGeneralToast('Response added successfully!', 'success');
    
                    // Cập nhật lại danh sách review
                    fetchReviewsWithProducts();
    
                    // Đóng modal
                    closeModal();
                })
                .catch((error) => {
                    console.error('Error adding response:', error);
    
                    // Hiển thị thông báo lỗi
                    if (error.response && error.response.data) {
                        const { message } = error.response.data;
                        setErrorMessage(message);
                        showGeneralToast(message, 'error');
                    } else {
                        setErrorMessage('Failed to submit response. Please try again.');
                        showGeneralToast('Failed to submit response. Please try again.', 'error');
                    }
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
    <h2>Đánh giá chưa có phản hồi</h2>
    {isLoading ? (
        <p>Đang tải...</p>
    ) : reviewsWithProducts.length === 0 ? (
        <p>Không có đánh giá chưa có phản hồi.</p>
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
                            <p>Giá: ${review.productPrice}</p>
                        </div>
                    </div>
                    <p>
                        <strong>Đánh giá:</strong> 
                        <span className="stars">{renderStars(review.rating)}</span>
                    </p>
                    <p><strong>Nhận xét:</strong> {review.comment}</p>
                    <button onClick={() => openModal(review)}>Phản hồi</button>
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
            <h1>Phản hồi đánh giá</h1>
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
                    <p>Giá: ${selectedReview.productPrice}</p>
                    <p>
                        <strong>Đánh giá:</strong> 
                        <span className="stars">{renderStars(selectedReview.rating)}</span>
                    </p>
                </div>
            </div>
            <h2>
                <strong style={{ color: 'red' }}>Đánh giá:</strong> {selectedReview.comment}
            </h2>
            <textarea
                value={response}
                onChange={(e) => {
                    setResponse(e.target.value);
                    setErrorMessage('');
                }}
                placeholder="Viết phản hồi của bạn..."
            ></textarea>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={submitResponse}>Gửi phản hồi</button>
            <button onClick={closeModal}>Đóng</button>
        </Modal>
    )}
</div>

    );
};

export default ReviewResponsePage;
