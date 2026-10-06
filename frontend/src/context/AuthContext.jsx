import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("kalika_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: "admin-1",
          name: "Receptionist Admin",
          email: "admin@kalikahotel.com",
          role: "admin", // "admin" or "guest"
        };
  });

  useEffect(() => {
    localStorage.setItem("kalika_user", JSON.stringify(user));
  }, [user]);

  const login = (email, password, role = "admin") => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: role === "admin" ? "Front Desk Staff" : "Valued Guest",
      email: email || "staff@kalikahotel.com",
      role,
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    setUser((prev) => {
      const nextRole = prev?.role === "admin" ? "guest" : "admin";
      return {
        id: `user-${Date.now()}`,
        name: nextRole === "admin" ? "Front Desk Staff" : "Valued Guest",
        email: nextRole === "admin" ? "admin@kalikahotel.com" : "guest@gmail.com",
        role: nextRole,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleRole, isAdmin: user?.role === "admin" }}>
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
