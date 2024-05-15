import React, { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { isAuthenticate } from "../services/auth";
import Login from "../pages/auth/Login";

interface ContextType {
  user: any;
}

export const AuthContext = React.createContext<ContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [cookies] = useCookies();

  useEffect(() => {
    const checkLogin = () => {
      let user = isAuthenticate(cookies);
      if (!user) {
        localStorage.setItem("user", "");
        user = "";
      }
      setUser(user);
    };
    checkLogin();
  }, [cookies]);

  return (
    <AuthContext.Provider value={{ user }}>
      {user ? children : <Login />}
    </AuthContext.Provider>
  );
};
