import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StoreService from "../services/store.service"; 

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState({
    storeName: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission
    const updatedStore = { ...store };

    try {
      const response = await StoreService.editStore(id, updatedStore); // ใช้ฟังก์ชัน editStore
      if (response.status === 200) {
        Swal.fire({
          title: "Store Update",
          text: response.data.message,
          icon: "success",
        });
        navigate("/"); // เปลี่ยนเส้นทางหลังจากแก้ไข
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
    <div className="container flex flex-col items-center p-4 mx-auto space-y-6">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Store Name</span>
            </label>
            <input
              type="text"
              placeholder="Store Name"
              className="input input-bordered"
              required
              name="storeName"
              id="storeName"
              value={store.storeName}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              placeholder="Store Address"
              className="input input-bordered"
              required
              name="address"
              id="address"
              value={store.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Latitude</span>
            </label>
            <input
              type="number"
              placeholder="Latitude"
              className="input input-bordered"
              required
              name="latitude"
              id="latitude"
              value={store.latitude}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Longitude</span>
            </label>
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered"
              required
              name="longitude"
              id="longitude"
              value={store.longitude}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Delivery Radius (in km)</span>
            </label>
            <input
              type="number"
              placeholder="Delivery Radius"
              className="input input-bordered"
              required
              name="deliveryRadius"
              id="deliveryRadius"
              value={store.deliveryRadius}
              onChange={handleChange}
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" type="submit">
              Update Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
