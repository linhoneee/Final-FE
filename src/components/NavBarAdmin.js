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
      console.error('Error fetching unanswered review count:', error);
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
                <Link to={`/userDetails/${userID}`}>Welcome, {username}!</Link>
              </li>

              {/* Các mục trong Product Management hiển thị trực tiếp */}
              <li className="navbar-admin-item">
                <Link to="/brands">Brands</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/categories">Categories</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/productsadmin">Products Admin</Link>
              </li>

              {/* Các mục khác */}
              <li className="navbar-admin-item">
                <Link to="/userList">List User</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/shippinglist">List Shipping</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/warehouses">Warehouse List</Link>
              </li>

              <li className="navbar-admin-item">
                <Link to="/customer-coupons">Customer Coupons List</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to="/reviews/responses">
                  Reviews Responses {unansweredReviewCount > 0 && <span className="navbar-admin-cart-count">{unansweredReviewCount}</span>}
                </Link>
              </li>
              <li className="navbar-admin-item">
                <Link to={`/userDetails/${userID}`}>Account Details</Link>
              </li>
              <li className="navbar-admin-item">
                <Link to={`/chat/${userID}`}>Chat</Link>
              </li>
              <li className="navbar-admin-item">
                <button className="navbar-admin-logout-button" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="navbar-admin-item">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    )
  );
};

export default NavBarAdmin;
