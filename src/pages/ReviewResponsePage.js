import React, { useEffect, useState } from 'react';
import ReviewService from '../services/ReviewService';
import Modal from 'react-modal';
import '../Css/ReviewResponsePage.css';


const ReviewResponsePage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [response, setResponse] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        ReviewService.getReviewsWithoutResponses()
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
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
                userId: 1, // Change to the current user's ID
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
            <div className="review-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-item">
                        <p><strong>{review.comment}</strong></p>
                        <p>Product ID: {review.productId}</p>
                        <button onClick={() => openModal(review)}>Respond</button>
                    </div>
                ))}
            </div>
            
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
