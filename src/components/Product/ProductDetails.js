import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService'; // Import CategoryService
import BrandService from '../../services/BrandService'; // Import BrandService
import ReviewService from '../../services/ReviewService';
import CartService from '../../services/CartService';
import Modal from 'react-modal';
import './ProductDetails.css'; // Import the new CSS file
import './AnimationAddToCart.css'; // Import the updated CSS file
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItemCount } from '../../store/actions/cartActions';

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
  const [averageRating, setAverageRating] = useState(0); // State to store average rating
  const [category, setCategory] = useState(null); // State to store category
  const [brand, setBrand] = useState(null); // State to store brand
  const navigate = useNavigate();
  const userID = useSelector(state => state.auth.userID); // Get userID from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch product details
    ProductService.GetProductById(id)
      .then(response => {
        setProduct(response.data.product);
        setImages(response.data.productImages);
        const primaryImg = response.data.productImages.find(image => image.isPrimary);
        setPrimaryImage(primaryImg);
        setLoading(false);

        // Call function to add product to recently viewed
        addToRecentlyViewed({
          id: response.data.product.id,
          name: response.data.product.productName,
          price: response.data.product.price,
          imageUrl: primaryImg ? primaryImg.url : ''
        });

        // Fetch category and brand details
        fetchCategoryAndBrand(response.data.product.categoryId, response.data.product.brandId);
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

        // Calculate average rating for reviews without parentId
        const rootReviews = response.data.filter(review => review.review.parentId === null);
        const totalRating = rootReviews.reduce((acc, review) => acc + review.review.rating, 0);
        const avgRating = rootReviews.length ? (totalRating / rootReviews.length) : 0;
        setAverageRating(avgRating);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [id]);

  // Fetch category and brand details
  const fetchCategoryAndBrand = (categoryId, brandId) => {
    // Fetch category details
    CategoryService.getCategoryById(categoryId)
      .then(response => {
        setCategory(response.data); // Set the category state
      })
      .catch(error => {
        console.error('Error fetching category:', error);
      });
  
    // Fetch brand details
    BrandService.getBrandById(brandId)
      .then(response => {
        console.log("Brand data: ", response.data);  // Debugging line
        setBrand(response.data); // Set the brand state
      })
      .catch(error => {
        console.error('Error fetching brand:', error);
      });
  };
  
  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const triggerFlyToCartEffect = () => {
    const productImage = document.querySelector('.product-main-image');
    if (!productImage) {
      console.log("productImage not found");
      return;
    }
  
    const clonedImage = productImage.cloneNode(true);
    const imageRect = productImage.getBoundingClientRect();
  
    // Đặt hình ảnh sao chép vào đúng vị trí của hình ảnh gốc
    clonedImage.style.position = 'absolute';
    clonedImage.style.top = `${imageRect.top}px`;
    clonedImage.style.left = `${imageRect.left}px`;
    clonedImage.style.width = `${imageRect.width}px`;
    clonedImage.style.height = `${imageRect.height}px`;
    clonedImage.classList.add('fly-to-cart');
  
    document.body.appendChild(clonedImage);
  
    clonedImage.addEventListener('animationend', () => {
      clonedImage.remove();
    });
  };
  
  // Hàm lưu thông tin vào localStorage
  const addToRecentlyViewed = (product) => {
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    // Kiểm tra nếu sản phẩm đã có trong danh sách
    if (!viewedProducts.some(item => item.id === product.id)) {
      viewedProducts.push(product);
      localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    }
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
        triggerFlyToCartEffect();
        dispatch(fetchCartItemCount(userID)); // Fetch updated cart item count after adding to cart

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
            <span><strong>Đánh Giá:</strong> {review.review.comment}</span>
            <span className="date"><strong>Ngày:</strong> {new Date(review.review.createdAt).toLocaleString()}</span>
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
          <div className="product-header">
            <h2>{product.productName}</h2>
            <div className="average-rating">
              <span className="average-rating-number">{averageRating.toFixed(1)} / 5</span>
              <div className="rating">
                {renderStars(averageRating)} {/* Render average rating stars */}
              </div>
            </div>
            <span className="review-count">({product.numReviews} Đánh Giá)</span>
          </div>



          <div className="buttons-container">
            <button onClick={addToCart}>Thêm Vào Giỏ Hàng</button>
            <button onClick={() => navigate(-1)}>Quay Lại Trang Trước</button>
          </div>
          <div className="product-info">
            <div className="product-images-container">
              <img 
                src={`http://localhost:6001${primaryImage?.url}`} 
                alt="Primary" 
                className="product-main-image"
                onClick={() => openModal(primaryImage)} // Add this line to handle click on primary image
              />
              <div className="product-images">
                {images.map(image => (
                  <img
                    key={image.id}
                    src={`http://localhost:6001${image.url}`}
                    alt={`Product ${product.productName}`}
                    onClick={() => openModal(image)}
                  />
                ))}
              </div>
            </div>

            <div className="product-details">
              <p className="price"><span>${product.price}</span> {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}</p>
              <div className="product-info">
  <div className="product-info-item">
    <strong>Trọng Lượng:</strong> <span>{product.weight} g</span>
  </div>

  {/* Display category information */}
  {category && (
    <div className="product-info-item">
      <strong>Thể Loại:</strong> <span>{category.name}</span>
      <p>{category.description}</p>
    </div>
  )}

  {/* Display brand information */}
  {brand && (
    <div className="product-info-item">
      <strong>Thương Hiệu:</strong> <span>{brand.name}</span>
      <p>{brand.description}</p>
    </div>
  )}
</div>


            </div>
          </div>

          <div className="review-container">
            <h3>Đánh Giá</h3>
            {reviews.length > 0 ? (
              renderReviews(reviews)
            ) : (
              <p>Không Có Đánh Giá</p>
            )}
          </div>

          {selectedImage && (
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    className="modal-content"
    style={{
      content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '550px',
        height: '550px',
        margin: 'auto', // Căn giữa modal
        padding: '0', // Loại bỏ khoảng padding mặc định
        borderRadius: '8px', // Thêm border radius cho modal (tuỳ chọn)
        top: '40px',
        right:'110px',
      },
    }}
  >
    <img
      src={`http://localhost:6001${selectedImage.url}`}
      alt="Selected"
      style={{
        width: '100%', // Đảm bảo ảnh tự động co giãn theo kích thước modal
        height: '100%', // Đảm bảo ảnh không vượt ra ngoài
        objectFit: 'cover', // Giữ tỷ lệ và lấp đầy khung ảnh
        borderRadius: '8px', // Thêm border-radius cho ảnh nếu muốn
      }}
    />

  </Modal>
  
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
