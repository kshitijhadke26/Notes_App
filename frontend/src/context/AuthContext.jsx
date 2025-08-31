import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem("token", access_token);
      
      // For now, create a simple user object (in real app, you'd fetch user details)
      const userData = { email, username: email.split('@')[0] };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axiosClient.post("/auth/signup", { 
        username, 
        email, 
        password 
      });
      
      // After successful signup, log the user in
      await login(email, password);
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};