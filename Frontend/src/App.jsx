import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";
import StoreService from "./services/store.service";
import Seven from "./assets/24.png";
import Seven2 from "./assets/24close.png";
import "./App.css";
import { useAuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";

function App() {
  const center = [13.838514948417762, 100.02530203017818];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ latitude: "", longitude: "" });
  const { user } = useAuthContext();
  const [deliveryZone, setDeliveryZone] = useState({
    latitude: "",
    longitude: "",
    radius: 0,
  });
  const [activeStore, setActiveStore] = useState(null);
  const navigate = useNavigate();

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; 
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;

    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await StoreService.getAllStores();
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching the stores:", error);
      }
    };

    fetchStores();
  }, []);

  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ latitude: lat, longitude: lng });
        console.log("Clicked at latitude: " + lat + " longitude: " + lng);
      },
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation({ latitude, longitude });
          Swal.fire({
            title: "Location Found",
            text: `Latitude: ${latitude}, Longitude: ${longitude}`,
            icon: "success",
            confirmButtonText: "OK",
          });
        },
        (error) => {
          Swal.fire({
            title: "Error",
            text: "Unable to retrieve your location. Please allow location access.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      Swal.fire({
        title: "Error",
        text: "Geolocation is not supported by your browser.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLocationCheck = () => {
    if (!myLocation.latitude || !myLocation.longitude) {
      Swal.fire({
        title: "Error",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (activeStore) {
      const distance = calculateDistance(
        myLocation.latitude,
        myLocation.longitude,
        activeStore.latitude,
        activeStore.longitude
      );

      if (distance <= deliveryZone.radius) {
        Swal.fire({
          title: "Success",
          text: "You are within the delivery zone of the selected store.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "You are outside the delivery zone of the selected store.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Please select a store first.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStoreCheck = (store) => {
    if (activeStore && activeStore.id === store.id) {
      setActiveStore(null);
      setDeliveryZone((prev) => ({ ...prev, radius: 0 })); // รีเซ็ตค่าเมื่อยกเลิกการเลือก
    } else {
      setActiveStore(store);
      setDeliveryZone({
        latitude: store.latitude,
        longitude: store.longitude,
        radius: store.deliveryRadius * 0.5, 
      });
    }
  };
  

  const handleEdit = (storeId) => {
    // นำทางไปยังหน้าการแก้ไขของร้านค้านั้น
    navigate(`/edit/${storeId}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await StoreService.deleteStore(id); // Assuming deleteStore is defined in StoreService
          setStores((prevStores) => prevStores.filter((s) => s.id !== id));
          Swal.fire("Deleted!", "The store has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was a problem deleting the store.",
            "error"
          );
        }
      }
    });
  };

  const inDeliveryZoneIcon = L.icon({
    iconUrl: Seven,
    iconSize: [35, 35],
  });

  const outOfDeliveryZoneIcon = L.icon({
    iconUrl: Seven2,
    iconSize: [35, 35],
  });

  const { logout, isAuthenticated, userRoles } = useAuthContext();

  const handleLogout = () => {
    logout();
    Swal.fire({
      title: "Logout Success",
      text: "You have been logged out successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // ตรวจสอบว่าผู้ใช้มีบทบาทเป็น admin หรือไม่
  const isAdmin = userRoles && userRoles.includes("admin");

  return (
    <>
      <Navbar
        className="my-4"
        onGetLocation={handleGetLocation}
        onCheckDelivery={handleLocationCheck}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      <div className="mapContainer flex flex-col items-center px-4">
        {isAuthenticated && isAdmin && (
          <div className="admin-buttons flex flex-col md:flex-row md:justify-between mb-4 w-full">
          
            <button
              onClick={() => {
                /* Function to handle Add */
              }}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-full md:w-auto mb-2 md:mb-0"
            >
              Add
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 w-full md:w-auto"
            >
              Logout
            </button>
          </div>
        )}
        <MapContainer
          center={center}
          zoom={16}
          className="h-[75vh] w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {myLocation.latitude && myLocation.longitude && (
            <Marker
              position={[myLocation.latitude, myLocation.longitude]}
              icon={L.icon({
                iconUrl:
                  "https://cdn-icons-png.flaticon.com/128/6924/6924565.png",
                iconSize: [35, 35],
              })}
            >
              <Popup>My current location.</Popup>
            </Marker>
          )}
          {stores.map((store) => {
            const distance = calculateDistance(
              myLocation.latitude,
              myLocation.longitude,
              store.latitude,
              store.longitude
            );
            const isInDeliveryZone = distance <= deliveryZone.radius;

            return (
              <Marker
                position={[store.latitude, store.longitude]}
                key={store.id}
                icon={
                  isInDeliveryZone ? inDeliveryZoneIcon : outOfDeliveryZoneIcon
                }
                eventHandlers={{
                  click: () => handleStoreCheck(store),
                }}
              >
                <Popup>
                  <b>Store Name: {store.storeName}</b>
                  <br />
                  <>Address: {store.address}</>
                  <p>Latitude: {store.latitude}</p>
                  <p>Longitude: {store.longitude}</p>

                  {user && user.roles.includes("ROLES_ADMIN") && store.adminId === user.id && (
  <div className="flex flex-col gap-2">
    <button
      onClick={() => handleEdit(store.id)}
      className="text-blue-600 hover:underline"
    >
      Edit Store
    </button>
    <button
      onClick={() => handleDelete(store.id)}
      className="text-red-600 hover:underline"
    >
      Delete Store
    </button>
  </div>
)}

                </Popup>
              </Marker>
            );
          })}

          {/* แสดงวงกลมสำหรับร้านค้าที่ถูกเลือก */}
          {activeStore && (
            <Circle
              center={[activeStore.latitude, activeStore.longitude]}
              radius={deliveryZone.radius}
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.1,
              }}
            />
          )}

          <LocationMap />
        </MapContainer>
      </div>
    </>
  );
}

export default App;
