import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StoreService from "../services/store.service";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../context/AuthContext";
const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [store, setStore] = useState({
    storeName: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
    adminId: user.id,
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await StoreService.getStoreById(id);
        if (response.status === 200) {
          setStore(response.data);
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch store data.",
          icon: "error",
        });
      }
    };

    fetchStore();
  }, [id]);

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedStore = { ...store };

    try {
      const adminId = user.id;
      const response = await StoreService.editStore(id, updatedStore, adminId);
      if (response.status === 200) {
        Swal.fire({
          title: "Store Update",
          text: response.data.message,
          icon: "success",
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "Store Update",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4">
      <Navbar isEditPage={true} />
      <div className="mt-10 w-full max-w-md">
        <div>
          <h1 className="text-2xl text-purple-500 text-center mb-4 bg-purple-100 p-3 rounded-lg border border-purple-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Store Information
          </h1>
          <form
            className="bg-yellow-50 p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          >
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Store Name:</span>
              <input
                type="text"
                name="storeName"
                className="grow border border-gray-300 rounded-md p-2"
                placeholder="Enter Store Name"
                value={store.storeName}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Address:</span>
              <input
                type="text"
                name="address"
                className="grow border border-gray-300 rounded-md p-2"
                placeholder="Enter Store Address"
                value={store.address}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Latitude:</span>
              <input
                type="number"
                name="latitude"
                className="grow border border-gray-300 rounded-md p-2"
                placeholder="Enter Latitude"
                value={store.latitude}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Longitude:</span>
              <input
                type="number"
                name="longitude"
                className="grow border border-gray-300 rounded-md p-2"
                placeholder="Enter Longitude"
                value={store.longitude}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Delivery Radius (in km):</span>
              <input
                type="number"
                name="deliveryRadius"
                className="grow border border-gray-300 rounded-md p-2"
                placeholder="Enter Delivery Radius"
                value={store.deliveryRadius}
                onChange={handleChange}
                required
              />
            </label>
            <button
              type="submit"
              className="btn btn-success bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-300 mt-4 w-full"
            >
              Update Store
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
