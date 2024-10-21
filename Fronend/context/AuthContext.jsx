/* eslint-disable react/prop-types */
import {useState, useContext, createContext, useEffect} from "react";
import AuthService from "../services/auth.service";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser);
  const login = (user) => setUser(user);
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  function getUser() {
    const temp = localStorage.getItem("user");
    const savedUser = JSON.parse(temp); //แปลงjson เป็นสตริง
    return savedUser || null;
  }
  useEffect(() => {
    const temp = JSON.stringify(user); //แปลงสติงเป็นjson
    localStorage.setItem("user", temp);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => useContext(AuthContext);