import React, { useEffect, useState } from 'react';
import ReviewService from '../services/ReviewService';
import Modal from 'react-modal';
import './ReviewResponsePage.css';
import { useSelector} from 'react-redux';

const ReviewResponsePage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [response, setResponse] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Thêm state isLoading
    const userID = useSelector(state => state.auth.userID);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        setIsLoading(true); // Đặt isLoading thành true khi bắt đầu tải dữ liệu
        ReviewService.getReviewsWithoutResponses()
            .then(response => {
                setReviews(response.data);
                setIsLoading(false); // Đặt isLoading thành false khi dữ liệu đã được tải
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                setIsLoading(false); // Đặt isLoading thành false ngay cả khi có lỗi
            });
    };

    const openModal = (review) => {
        setSelectedReview(review);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedReview(null);
        setResponse('');
        setModalIsOpen(false);
    };

    const submitResponse = () => {
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
                    fetchReviews();
                    closeModal();
                })
                .catch(error => {
                    console.error('Error adding response:', error);
                    alert('Failed to add response');
                });
        }
    };

    return (
        <div className="review-response-page">
            <h2>Reviews Without Responses</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews without responses.</p>
            ) : (
                <div className="review-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <p><strong>{review.comment}</strong></p>
                            <p>Product ID: {review.productId}</p>
                            <button onClick={() => openModal(review)}>Respond</button>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedReview && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content">
                    <h3>Respond to Review</h3>
                    <p><strong>{selectedReview.comment}</strong></p>
                    <textarea 
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Write your response..."
                    ></textarea>
                    <button onClick={submitResponse}>Submit Response</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            )}
        </div>
    );
};

export default ReviewResponsePage;
