import React, { useState } from "react";
import StoreService from "../services/store.service"; // เปลี่ยนชื่อ service ให้ตรง
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'; // ใช้ Font Awesome
import Navbar from "../components/Navbar";

const AddStore = () => {
  const [store, setStore] = useState({
    storeName: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // ดึง adminId จาก localStorage
    const adminId = JSON.parse(localStorage.getItem("user"))?.id;
  
    const storeData = {
      ...store,
      adminId: adminId,
      latitude: parseFloat(store.latitude),
      longitude: parseFloat(store.longitude),
      deliveryRadius: parseFloat(store.deliveryRadius) * 1000, 
    };
  
    try {
      const response = await StoreService.insertStore(storeData);
      console.log(response.data);
  
      if (response.status === 200) {
        Swal.fire({
          title: "Add Store",
          text: "Store Added Successfully",
          icon: "success",
        });
        setStore({
          storeName: "",
          address: "",
          latitude: "",
          longitude: "",
          deliveryRadius: "",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Add Store",
        text: error.response.data.message || error.message,
        icon: "error",
      });
    }
  };
  

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4">
      <Navbar />
      <div className="mt-10 w-full max-w-md"> {/* ใช้ max-w-md เพื่อจำกัดความกว้าง */}
        <div>
          <h1 className="text-2xl text-purple-500 text-center mb-4 bg-purple-100 p-3 rounded-lg border border-purple-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Store
          </h1>
          <form onSubmit={handleSubmit} className="bg-yellow-50 p-6 rounded-lg shadow-lg">
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="font-semibold">Store Name:</span>
              <input
                type="text"
                name="storeName"
                className="grow border border-gray-300 rounded-md p-2" // เพิ่ม border และ padding
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
            <button type="submit" className="btn btn-success bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-300 mt-4 w-full">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Store
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
  
  
};

export default AddStore;
