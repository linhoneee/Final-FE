import React, { useState } from "react";
import ReviewService from "../../services/ReviewService";
import "./ReviewModal.css";
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function

const ReviewModal = ({ order, product, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        // Kiểm tra nếu comment trống
        if (!comment) {
            setError("Bình luận là bắt buộc");
            showGeneralToast("Bình luận là bắt buộc", "error");  // Thông báo lỗi
            return;
        }
    
        // Kiểm tra nếu thiếu Product ID hoặc User ID
        if (!product.productId || !order.userId) {
            setError("Thiếu Product ID hoặc User ID");
            showGeneralToast("Thiếu Product ID hoặc User ID", "error");  // Thông báo lỗi
            return;
        }
    
        try {
            // Thêm review
            await ReviewService.addReview({
                productId: product.productId,
                userId: order.userId,
                rating,
                comment,
                parentId: null,
            });
    
            // Hiển thị thông báo thành công
            showGeneralToast('Đánh giá đã được gửi thành công!', 'success');
    
            // Gọi onSuccess với order ID và product ID
            onSuccess(order.id, product.productId);
        } catch (err) {
            setError(err.message);
            
            // Hiển thị thông báo lỗi nếu có
            showGeneralToast("Gửi đánh giá thất bại. Vui lòng thử lại.", "error"); // Thông báo lỗi
        }
    };
    

    return (
        <div className="modal-review">
            <div className="modal-review-content">
                <h2>Đánh giá sản phẩm {product.name}</h2>
                {error && <p className="error">{error}</p>}
                <label>
                    Đánh giá:
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
                    Bình luận:
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </label>
                <button onClick={handleSubmit}>Gửi đánh giá</button>
                <button className="close" onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
    
};

export default ReviewModal;
