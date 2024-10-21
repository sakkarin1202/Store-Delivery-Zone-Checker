import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Swal from "sweetalert2";

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
      const register = await AuthService.register(user.username, user.email, user.password,user.address,user.latitude,user.longitude);

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

  return (
    <div className="container mx-auto max-w-96 my-auto p-4">
      {/* Username Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="username"
          className="grow"
          placeholder="Username"
          onChange={handleChange}
        />
      </label>

      {/* Password Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="password"
          name="password"
          className="grow"
          placeholder="Password"
          onChange={handleChange}
        />
      </label>

      {/* Email Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="email"
          className="grow"
          placeholder="Email"
          onChange={handleChange}
        />
      </label>

      {/* Address Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="address"
          className="grow"
          placeholder="Address"
          onChange={handleChange}
        />
      </label>

      {/* Latitude Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="latitude"
          className="grow"
          placeholder="Latitude"
          onChange={handleChange}
        />
      </label>

      {/* Longitude Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="longitude"
          className="grow"
          placeholder="Longitude"
          onChange={handleChange}
        />
      </label>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="btn btn-accent" onClick={handleSubmit}>
          Register
        </button>
        <button className="btn btn-error" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Register;
