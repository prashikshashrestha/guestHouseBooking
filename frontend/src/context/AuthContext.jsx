import React, { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("kalika_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("kalika_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("kalika_user");
      localStorage.removeItem("kalika_token");
    }
  }, [user]);

  const login = async (email, password, role = "guest") => {
    setLoading(true);
    setError(null);
    try {
      // Attempt backend API login if available
      try {
        const response = await authApi.login({ email, password });
        if (response.data && response.data.user) {
          const apiUser = {
            ...response.data.user,
            role: response.data.user.role || role,
          };
          if (response.data.token) {
            localStorage.setItem("kalika_token", response.data.token);
          }
          setUser(apiUser);
          setLoading(false);
          return apiUser;
        }
      } catch (apiErr) {
        // Backend not running or endpoint not yet configured; use seamless mock auth
      }

      // Seamless fallback auth for prototype / offline mode
      const dummyUser = {
        id: `user-${Date.now()}`,
        name: role === "admin" ? "Receptionist Admin" : (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Valued Guest"),
        email: email || (role === "admin" ? "admin@kalikahotel.com" : "guest@example.com"),
        role,
      };
      localStorage.setItem("kalika_token", `mock-token-${Date.now()}`);
      setUser(dummyUser);
      setLoading(false);
      return dummyUser;
    } catch (err) {
      setError(err.message || "Failed to log in");
      setLoading(false);
      throw err;
    }
  };

  const register = async ({ fullName, email, phone, password }) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await authApi.register({ fullName, email, phone, password });
        if (response.data && response.data.user) {
          const apiUser = {
            ...response.data.user,
            role: "guest",
          };
          if (response.data.token) {
            localStorage.setItem("kalika_token", response.data.token);
          }
          setUser(apiUser);
          setLoading(false);
          return apiUser;
        }
      } catch (apiErr) {
        // Offline / mock fallback
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: fullName || "Valued Guest",
        email: email || "guest@example.com",
        phone: phone || "",
        role: "guest",
      };
      localStorage.setItem("kalika_token", `mock-token-${Date.now()}`);
      setUser(newUser);
      setLoading(false);
      return newUser;
    } catch (err) {
      setError(err.message || "Failed to register account");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kalika_user");
    localStorage.removeItem("kalika_token");
  };

  const loginAsDemo = (role = "guest") => {
    if (role === "admin") {
      return login("admin@kalikahotel.com", "admin123", "admin");
    }
    return login("guest@example.com", "guest123", "guest");
  };

  const toggleRole = () => {
    setUser((prev) => {
      const nextRole = prev?.role === "admin" ? "guest" : "admin";
      return {
        id: prev?.id || `user-${Date.now()}`,
        name: nextRole === "admin" ? "Receptionist Admin" : "Valued Guest",
        email: nextRole === "admin" ? "admin@kalikahotel.com" : "guest@gmail.com",
        role: nextRole,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        loginAsDemo,
        toggleRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
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

