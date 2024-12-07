import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';
import ReviewService from '../services/ReviewService';
import './NavBarAdmin.css';

const NavBarAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username);
  const userID = useSelector(state => state.auth.userID);
  const roles = useSelector(state => state.auth.roles);
  
  const [unansweredReviewCount, setUnansweredReviewCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn && roles === 'ADMIN') {
      fetchUnansweredReviewCount();
    }
  }, [isLoggedIn, roles]);

  const fetchUnansweredReviewCount = async () => {
    try {
      const response = await ReviewService.getReviewsWithoutResponses();
      setUnansweredReviewCount(response.data.length);
    } catch (error) {
      console.error('Lỗi khi lấy số lượng đánh giá chưa được phản hồi:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    roles === 'ADMIN' && ( 
      <nav className="navbar-admin-container navbar-admin-vertical">
        <div className="navbar-admin-logo">
          <Link to="/dashboard">Green Home</Link>
        </div>
        <ul className="navbar-admin-links">
          {isLoggedIn ? (
            <>
              <li className="navbar-admin-item navbar-admin-welcome">
                <Link to={`/userDetails/${userID}`}>Chào mừng, {username}!</Link>
              </li>

              {/* Các mục trong Quản lý sản phẩm hiển thị trực tiếp */}
              <li className="navbar-admin-item">
                <Link to="/brands">Thương hiệu</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/categories">Danh mục</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/productsadmin">Quản lý sản phẩm</Link>
              </li>

              {/* Các mục khác */}
              <li className="navbar-admin-item">
                <Link to="/userList">Danh sách người dùng</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/shippinglist">Danh sách vận chuyển</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/warehouses">Danh sách kho</Link>
              </li>

              <li className="navbar-admin-item">
                <Link to="/customer-coupons">Danh sách phiếu giảm giá khách hàng</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/reviews/responses">
                  Phản hồi đánh giá {unansweredReviewCount > 0 && <span className="navbar-admin-cart-count">{unansweredReviewCount}</span>}
                </Link>
              </li>
              <li className="navbar-admin-item">
                <Link to={`/userDetails/${userID}`}>Chi tiết tài khoản</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to={`/chat/${userID}`}>Trò chuyện</Link>
              </li>
              <li className="navbar-admin-item">
                <button className="navbar-admin-logout-button" onClick={handleLogout}>Đăng xuất</button>
              </li>
            </>
          ) : (
            <li className="navbar-admin-item">
              <Link to="/login">Đăng nhập</Link>
            </li>
          )}
        </ul>
      </nav>
    )
  );
};

export default NavBarAdmin;
