// src/components/Navbar.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';
import { fetchCartItemCount } from '../store/actions/cartActions'; // Import action
import './Navbar.css'; // Import the updated CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username);
  const userID = useSelector(state => state.auth.userID);
  const cartItemCount = useSelector(state => state.cart.itemCount); // Get cart item count from Redux store

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItemCount(userID)); // Fetch cart item count when Navbar is rendered
    }
  }, [isLoggedIn, userID, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar-component">
      <div className="navbar-component-logo">
        <Link to="/">Elder Wellness</Link>
      </div>
      <ul className="navbar-component-links">
        {isLoggedIn ? (
          <>
            <li className="navbar-component-item navbar-component-welcome">
              <Link to={`/userDetails/${userID}`}>Welcome, {username}!</Link>
            </li>
            <li className="navbar-component-item">
              <Link to="/productaddcart">Products</Link>
            </li>

            <li className="navbar-component-item">
              <Link to={`/cart/${userID}`} className="cart-link">
                Cart {cartItemCount > 0 && <span className="navbar-component-cart-count">{cartItemCount}</span>}
              </Link>
            </li>
            <li className="navbar-component-item">
              <Link to={`/order/${userID}`}>Order History</Link>
            </li>
            <li className="navbar-component-item">
              <Link to={`/userDetails/${userID}`}>Account Details</Link>
            </li>           
            <li className="navbar-component-item">
              <button className="navbar-component-logout-button" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li className="navbar-component-item">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
