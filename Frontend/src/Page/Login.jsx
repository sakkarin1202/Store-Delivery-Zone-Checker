import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'; 

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
      navigate("/login");  
    }
  } catch (error) {
    Swal.fire({
      title: "Login Error",
      text: error?.response?.data?.message || error.message,
      icon: "error",
    });
  }
};


return (
  <>
    <Navbar />
    <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4"> 
      <div className="bg-yellow-50 p-8 rounded-lg shadow-lg w-full max-w-md mt-10"> 
      <h1 className="text-2xl text-purple-500 text-center mb-4 bg-purple-100 p-3 rounded-lg border border-purple-300 flex items-center justify-center">
  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> 
  Login
</h1>
        
        {/* Username Input */}
        <label className="input input-bordered flex items-center gap-2 w-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            name="username"
            className="grow border border-gray-300 rounded-md p-2"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </label>

        {/* Password Input */}
        <label className="input input-bordered flex items-center gap-2 w-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="password"
            className="grow border border-gray-300 rounded-md p-2" 
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </label>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4 my-10"> 
          <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 w-full rounded-lg shadow-md hover:bg-gradient-to-l transition duration-300" onClick={handleSubmit}>
            Login
          </button>
          <button
            className="btn bg-red-500 text-white w-full rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            onClick={() => setUser({ username: "", password: "" })}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
);



};

export default Login;