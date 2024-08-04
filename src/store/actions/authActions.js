export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const login = (token, email, username, roles, userID) => {
  return dispatch => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('roles', roles);
    localStorage.setItem('userID', userID);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token, email, username, roles, userID }
    });
  };
};

export const logout = () => {
  return dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userID');
    localStorage.removeItem('reduxState'); // Xóa trạng thái Redux lưu trữ

    dispatch({ type: LOGOUT });
  };
};
