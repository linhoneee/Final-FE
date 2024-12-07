// src/components/Navbar.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';
import { fetchCartItemCount } from '../store/actions/cartActions';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username);
  const userID = useSelector(state => state.auth.userID);
  const roles = useSelector(state => state.auth.roles); // Lấy roles từ Redux store
  const cartItemCount = useSelector(state => state.cart.itemCount);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItemCount(userID));
    }
  }, [isLoggedIn, userID, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Kiểm tra nếu roles là 'USER' hoặc không có roles mới hiển thị Navbar
  if (roles && roles !== 'USER') {
    return null;
  }

  return (
    <nav className="navbar-component">
      <div className="navbar-component-logo">
        <Link to="/">Green Home</Link>
      </div>
      <ul className="navbar-component-links">
        {isLoggedIn ? (
          <>
            <li className="navbar-component-item navbar-component-welcome">
              <Link to={`/userDetails/${userID}`}>Xin chào, {username}!</Link>
            </li>
            <li className="navbar-component-item">
              <Link to="/productaddcart">Sản phẩm</Link>
            </li>
            <li className="navbar-component-item">
              <Link to={`/cart/${userID}`} className="cart-link">
                Giỏ hàng {cartItemCount > 0 && <span className="navbar-component-cart-count">{cartItemCount}</span>}
              </Link>
            </li>
            <li className="navbar-component-item">
              <Link to={`/order/${userID}`}>Lịch sử đặt hàng</Link>
            </li>
            <li className="navbar-component-item">
              <Link to={`/userDetails/${userID}`}>Thông tin tài khoản</Link>
            </li>           
            <li className="navbar-component-item">
              <button className="navbar-component-logout-button" onClick={handleLogout}>Đăng xuất</button>
            </li>
          </>
        ) : (
          <>
          <li className="navbar-component-item">
            <Link to="/login">Đăng nhập</Link>
          </li>
          <li className="navbar-component-item">
            <Link to="/register">Đăng ký</Link>
          </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
