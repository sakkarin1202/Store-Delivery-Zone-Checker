import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  // State to hold login values
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // Hooks
  const navigate = useNavigate();
  const { login, user: loggedInUser } = useAuthContext();
  
  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const currentUser = await AuthService.login(user.username, user.password);
      if (currentUser.status === 200) {
        login(currentUser.data);
        Swal.fire({
          title: "User Login",
          text: "Login Successfully",
          icon: "success",
        });
        setUser({
          username: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "User Registration",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Username Input */}
        <label className="block mb-4">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            name="username"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter your username"
            value={user.username}
            onChange={handleChange}
          />
        </label>

        {/* Password Input */}
        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleChange}
          />
        </label>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            className="btn btn-accent w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={handleSubmit}
          >
            Login
          </button>
          <button
            className="btn btn-error w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
            onClick={() => setUser({ username: "", password: "" })}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
