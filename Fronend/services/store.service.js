import api from "./api";
const STORE_API = import.meta.env.VITE_STORE_API; 
console.log(STORE_API);

// Get all stores
const getAllStores = async () => {
  return await api.get(STORE_API);
};

// Get store by ID
const getStoreById = async (id) => {
  return await api.get(`${STORE_API}/${id}`);
};

// Insert a new store
const insertStore = async (store) => {
  return await api.post(STORE_API, store);
};

// Update store data
const editStore = async (id, store) => {
  return await api.put(`${STORE_API}/${id}`, store);
};

// Delete store data
const deleteStore = async (id) => {
  return await api.delete(`${STORE_API}/${id}`);
};

// Exporting store service functions
const StoreService = {
  getAllStores,
  getStoreById,
  editStore,
  deleteStore,
  insertStore,
};

export default StoreService;
