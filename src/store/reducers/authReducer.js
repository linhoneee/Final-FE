import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const username = localStorage.getItem('username');
const roles = localStorage.getItem('roles');
const userID = localStorage.getItem('userID');

const initialState = {
  isLoggedIn: !!token,
  token: token || null,
  email: email || null,
  username: username || null,
  roles: roles || null,
  userID: userID || null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        ...action.payload
      };
    case LOGOUT:
      return {
        isLoggedIn: false,
        token: null,
        email: null,
        username: null,
        roles: null,
        userID: null
      };
    default:
      return state;
  }
};

export default authReducer;
