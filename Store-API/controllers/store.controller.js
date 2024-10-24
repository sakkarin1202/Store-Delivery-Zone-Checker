const Store = require("../models/store.model");

// Create a new store
exports.createStore = async (req, res) => {
  const { storeName, address, latitude, longitude, deliveryRadius, adminId } =
    req.body;
  console.log(req.body);

  if (
    !storeName ||
    !address ||
    latitude === undefined ||
    longitude === undefined ||
    deliveryRadius === undefined
  ) {
    return res.status(400).send({
      message:
        "StoreName, Address, Latitude, Longitude, or DeliveryRadius cannot be empty",
    });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      adminId = decoded.id;
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
  }

  try {
    const existingStore = await Store.findOne({
      where: { storeName: storeName },
    });

    if (existingStore) {
      return res.status(400).send({ message: "Store already exists!" });
    }

    const newStore = {
      storeName: storeName,
      address: address,
      latitude: latitude,
      longitude: longitude,
      deliveryRadius: deliveryRadius,
      adminId: adminId || null, // ตั้งค่า adminId ถ้าไม่มีจาก token
    };

    Store.create(newStore)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send({
          message:
            error.message ||
            "Something error occurred while creating the store.",
        });
      });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while creating the store.",
    });
  }
};

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.send(stores);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while fetching the stores.",
    });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  const id = req.params.id;
  try {
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).send({ message: "No store found with id " + id });
    }
    res.send(store);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while fetching the store.",
    });
  }
};

// Update store
exports.updateStore = async (req, res) => {
  const id = req.params.id;
  const adminId = req.userId;
  try {
    const [updated] = await Store.update(req.body, {
      where: { id: id, adminId: adminId },
    });

    if (updated) {
      return res.send({ message: "Store was updated successfully" });
    }
    res
      .status(404)
      .send({ message: "You don't have the right to edit this store." });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating the store.",
    });
  }
};

// Delete store
exports.deleteStore = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Store.destroy({
      where: { id: id },
    });

    if (deleted) {
      return res.send({ message: "Store was deleted successfully" });
    }
    res.status(404).send({ message: "Store not found" });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting store with id=" + id,
      error: error.message,
    });
  }
};
