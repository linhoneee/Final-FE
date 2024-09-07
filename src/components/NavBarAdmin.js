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
  
  const [unansweredReviewCount, setUnansweredReviewCount] = useState(0);
  const [isProductManagementOpen, setIsProductManagementOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUnansweredReviewCount();
    }
  }, [isLoggedIn]);

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

  const toggleProductManagement = () => {
    setIsProductManagementOpen(prevState => !prevState);
  };

  return (
    <nav className={`navbar-admin-container navbar-admin-vertical ${isProductManagementOpen ? 'navbar-expanded' : ''}`}>
      <div className="navbar-admin-logo">
        <Link to="/">Elder Wellness</Link>
      </div>
      <ul className="navbar-admin-links">
        {isLoggedIn ? (
          <>
            <li className="navbar-admin-item navbar-admin-welcome">
              <Link to={`/userDetails/${userID}`}>Welcome, {username}!</Link>
            </li>
            
            {/* Product Management Menu */}
            <li className="navbar-admin-item navbar-admin-dropdown-parent">
              <div className="navbar-admin-dropdown" onClick={toggleProductManagement}>
                Product Management
              </div>
              {isProductManagementOpen && (
                <ul className="navbar-admin-dropdown-menu">
                  <li className="navbar-admin-dropdown-item">
                    <Link to="/brands">Brands</Link>
                  </li>
                  <li className="navbar-admin-dropdown-item">
                    <Link to="/categories">Categories</Link>
                  </li>
                  <li className="navbar-admin-dropdown-item">
                    <Link to="/productsadmin">Products Admin</Link>
                  </li>
                </ul>
              )}
            </li>

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
              <Link to="/product-discounts">Product Discounts List</Link>
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
  );
};

export default NavBarAdmin;
