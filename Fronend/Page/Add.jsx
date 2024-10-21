import React, { useState } from "react";
import StoreService from "../services/store.service"; // เปลี่ยนชื่อ service ให้ตรง
import Swal from "sweetalert2";

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
    const adminId = JSON.parse(localStorage.getItem("user"))?.id; // แก้ไขให้เข้ากับโครงสร้างของ user object

    const storeData = {
      ...store,
      adminId: adminId,
      latitude: parseFloat(store.latitude),
      longitude: parseFloat(store.longitude),
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
    <div className="container mx-auto">
      <div>
        <h1 className="text-2xl text-center">Add Store</h1>
        <form onSubmit={handleSubmit}>
          <label className="input input-bordered flex items-center gap-2">
            Store Name
            <input
              type="text"
              name="storeName" // Ensure this matches state and API
              className="grow"
              placeholder="Store Name"
              value={store.storeName}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Address
            <input
              type="text"
              name="address" // Ensure this matches state and API
              className="grow"
              placeholder="Store Address"
              value={store.address}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Latitude
            <input
              type="number"
              name="latitude" // Ensure this matches state and API
              className="grow"
              placeholder="Latitude"
              value={store.latitude}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Longitude
            <input
              type="number"
              name="longitude" // Ensure this matches state and API
              className="grow"
              placeholder="Longitude"
              value={store.longitude}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Delivery Radius (in km)
            <input
              type="number"
              name="deliveryRadius" // Ensure this matches state and API
              className="grow"
              placeholder="Delivery Radius"
              value={store.deliveryRadius}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-success">
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
