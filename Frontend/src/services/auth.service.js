// import axios from "axios";
import api from "./api";
// import TokenService from "./token.service";

const API_URL = import.meta.env.VITE_AUTH_API;

const register = async (username, email, password,address,latitude,longitude) => {
  return await api.post(API_URL + "/signup", { username, email, password,address,latitude,longitude });
};

const login = async (username, password) => {
    console.log(username,password);
    console.log(API_URL+"/signin");
    
  const response = await api.post(API_URL + "/signin", { username, password });
  console.log(response.data);
  
  if (response.data.accessToken) {
    localStorage.setItem(
      "accessToken",
      JSON.stringify(response.data.accessToken)
    );
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  // You may also want to handle token invalidation on the server side if needed
};

const AuthService = {
  register,
  login,
  logout, // Add the logout function here
};

export default AuthService;