"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user profile

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("profile", JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem("profile"); 
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // Load user data from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};