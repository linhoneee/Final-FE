// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username);
  const userID = useSelector(state => state.auth.userID);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav>
      <div>
        <Link to="/">E-commerce CRUD</Link>
      </div>
      <ul>
        {isLoggedIn ? (
          <>
            <li>Welcome, {username}!</li>
            <li>
              <Link to="/brands">Brands</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/">HOME</Link>
            </li>
            <li>
              <Link to="/productsadmin">Products Admin</Link>
            </li>
            <li>
              <Link to="/productaddcart">Products User</Link>
            </li>
            <li>
              <Link to="/userList">List User</Link>
            </li>
            <li>
              <Link to={`/user/${userID}/addresses`}>List addresses</Link>
            </li>
            <li>
              <Link to={`/user/${userID}/add-addressplus`}>add-addressplus</Link>
            </li>
            <li>
              <Link to="/shippinglist">List Shipping</Link>
            </li>
            <li>
              <Link to="/warehouses">Warehouse List</Link>
            </li>
            <li>
              <Link to="/product-discounts">product-discounts List</Link>
            </li>
            <li>
              <Link to="/customer-coupons">customer-coupons List</Link>
            </li>
            /product-discounts
            <li>
              <Link to={`/message/${userID}`}>message</Link>
            </li>
            <li>
              <Link to={`/cart/${userID}`}>Cart</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
