// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const loginStatus = localStorage.getItem('token') !== null;
//     setIsLoggedIn(loginStatus);
//   }, []);

//   const login = (token, email, username, roles, userID) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('email', email);
//     localStorage.setItem('username', username);
//     localStorage.setItem('roles', roles);
//     localStorage.setItem('UserID', userID);
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
