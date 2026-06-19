import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [shippingDetails, setShippingDetails] = useState(null);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setCurrentUser(storedUser);
      setToken(storedToken); 
      setIsAuthenticated(true);
      setRole(storedUser.role);

      const shippingKey = `shipping_${storedUser._id}`;
      const savedShipping = JSON.parse(localStorage.getItem(shippingKey));

      if (savedShipping) {
        setShippingDetails(savedShipping);
      }
    }

    setAuthLoading(false);
  }, []);

 
  const saveShippingDetails = (details) => {
    if (!currentUser) return;

    const key = `shipping_${currentUser._id}`;
    localStorage.setItem(key, JSON.stringify(details));
    setShippingDetails(details);
  };

  
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setCurrentUser(userData);
    setToken(token); 
    setIsAuthenticated(true);
    setRole(userData.role);

    const shippingKey = `shipping_${userData._id}`;
    const savedShipping = JSON.parse(localStorage.getItem(shippingKey));
    setShippingDetails(savedShipping || null);
  };


  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setRole(null);
    setShippingDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        role,
        authLoading,
        shippingDetails,
        saveShippingDetails,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;