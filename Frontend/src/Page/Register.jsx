import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'; 

const Register = () => {
  // State to hold form values
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Check if all required fields are filled
      if (!user.username || !user.password || !user.email || !user.address || !user.latitude || !user.longitude) {
        Swal.fire({
          title: "Validation Error",
          text: "Please fill in all fields.",
          icon: "warning",
        });
        return;
      }

      // Call the register service
      const register = await AuthService.register(
        user.username,
        user.email,
        user.password,
        user.address,
        user.latitude,
        user.longitude
      );

      if (register.status === 200) {
        Swal.fire({
          title: "User Registered",
          text: register.data.message,
          icon: "success",
        });
        setUser({
          username: "",
          password: "",
          email: "",
          address: "",
          latitude: "",
          longitude: "",
        });
        navigate("/login"); // Redirect to login or another route after successful registration
      }
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text:
          error.response && error.response.data.message
            ? error.response.data.message
            : "Unknown error", // Safeguard in case error.response.data.message is undefined
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    setUser({
      username: "",
      password: "",
      email: "",
      address: "",
      latitude: "",
      longitude: "",
    });
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div>
      <Navbar showButtons={false} /> 
      <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4"> 
      <div className="bg-yellow-50 p-8 rounded-lg shadow-lg w-full max-w-md mt-10">
        <h1 className="text-2xl text-purple-500 text-center mb-4 bg-purple-100 p-3 rounded-lg border border-purple-300 flex items-center justify-center">
  <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> 
  Register
</h1>
          
          {/* Username Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              name="username"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Password Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
            </svg>
            <input
              type="password"
              name="password"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Email Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.174l6 3.25 6-3.25V4a1 1 0 0 0-1-1H2z" />
            </svg>
            <input
              type="email"
              name="email"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Address Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M8 0a1 1 0 0 0-1 1v2.086C5.09 3.55 3.5 5.416 3.5 8a5.5 5.5 0 0 0 11 0c0-2.584-1.59-4.45-3.5-4.914V1a1 1 0 0 0-1-1zM5.5 8a3.5 3.5 0 0 1 7 0A3.5 3.5 0 0 1 5.5 8z" />
            </svg>
            <input
              type="text"
              name="address"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Address"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Latitude Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M8 0a.5.5 0 0 0-.5.5v3.24A7.003 7.003 0 0 0 1 8a7 7 0 0 0 14 0 7.003 7.003 0 0 0-6.5-7.76V.5a.5.5 0 0 0-1 0v3.24A7.003 7.003 0 0 0 8 0zm1 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input
              type="text"
              name="latitude"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Latitude"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Longitude Input */}
          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M8 0a.5.5 0 0 0-.5.5v3.24A7.003 7.003 0 0 0 1 8a7 7 0 0 0 14 0 7.003 7.003 0 0 0-6.5-7.76V.5a.5.5 0 0 0-1 0v3.24A7.003 7.003 0 0 0 8 0zm1 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <input
              type="text"
              name="longitude"
              className="grow border border-gray-300 rounded-md p-2"
              placeholder="Longitude"
              onChange={handleChange}
              required
            />
          </label>
  
          {/* Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 w-full rounded-lg shadow-md hover:bg-gradient-to-l transition duration-300" onClick={handleSubmit}>
              Register
            </button>
            <button
              className="btn bg-red-500 text-white w-full rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
  
  
};

export default Register;
