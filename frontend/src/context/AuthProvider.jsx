import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "./AuthContext";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (
      decodedToken.exp &&
      decodedToken.exp * 1000 <= Date.now()
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to load authentication:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken.exp) {
        return;
      }

      const remainingTime =
        decodedToken.exp * 1000 - Date.now();

      if (remainingTime <= 0) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
      }

      const timeout = setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }, remainingTime);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error(
        "Failed to monitor authentication:",
        error
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;