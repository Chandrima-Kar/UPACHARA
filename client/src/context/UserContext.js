"use client";
import api from "@/utils/api";
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

  const updateProfile = async () => {
    try {
      const res = await api.get("/auth/doctor/profile");

      if (res.status === 200) {
        setUser(res.data);
        localStorage.setItem("profile", JSON.stringify(res.data)); 
      }
    } catch (error) {
      console.error("Error fetching updated profile:", error);
    }
  };

  // Load user data from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
