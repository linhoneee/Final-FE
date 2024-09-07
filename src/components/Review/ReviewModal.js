import React, { useState } from "react";
import ReviewService from "../../services/ReviewService";
import "./ReviewModal.css";

const ReviewModal = ({ order, product, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!comment) {
            setError("Comment is required");
            return;
        }

        if (!product.productId || !order.userId) {
            setError("Product ID or User ID is missing");
            return;
        }

        try {
            await ReviewService.addReview({
                productId: product.productId,
                userId: order.userId,
                rating,
                comment,
                parentId: null,
            });
            onSuccess(order.id, product.productId); // Call onSuccess with order ID and product ID
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-review">
            <div className="modal-review-content">
                <h2>Review Product {product.name}</h2>
                {error && <p className="error">{error}</p>}
                <label>
                    Rating:
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={rating >= star ? "filled" : ""}
                                onClick={() => setRating(star)}
                            >
                            </span>
                        ))}
                    </div>
                </label>
                <label>
                    Comment:
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </label>
                <button onClick={handleSubmit}>Submit Review</button>
                <button className="close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ReviewModal;
