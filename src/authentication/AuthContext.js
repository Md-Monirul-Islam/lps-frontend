// import React, { createContext, useState } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('userInfo');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const [tokens, setTokens] = useState(() => {
//     const savedTokens = localStorage.getItem('authTokens');
//     return savedTokens ? JSON.parse(savedTokens) : null;
//   });

//   const login = (tokens, userInfo) => {
//     setTokens(tokens);
//     setUser(userInfo);
//     localStorage.setItem('authTokens', JSON.stringify(tokens));
//     localStorage.setItem('userInfo', JSON.stringify(userInfo));
//   };

//   const logout = () => {
//     setTokens(null);
//     setUser(null);
//     localStorage.removeItem('authTokens');
//     localStorage.removeItem('userInfo');
//   };

//   return (
//     <AuthContext.Provider value={{ user, tokens, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('authToken');
    return savedToken ? savedToken : null;
  });

  const login = (token, userInfo) => {
    setToken(token);
    setUser(userInfo);

    // Save to localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    // Clear from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
