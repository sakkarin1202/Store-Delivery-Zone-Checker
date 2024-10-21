import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";
import StoreService from "../services/store.service"; 
import Seven from "./assets/24.png";
import Seven2 from "./assets/24close.png";
import "./App.css";
import {useAuthContext } from "../context/AuthContext"

function App() {
  const center = [13.838514948417762, 100.02530203017818];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ latitude: "", longitude: "" });
  const [deliveryZone, setDeliveryZone] = useState({
    latitude: "",
    longitude: "",
    radius: 1000,
  });
  const [activeStore, setActiveStore] = useState(null);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
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
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
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
    } else {
      setActiveStore(store);
    }
  };

  const handleDelete = (store) => {
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
          await StoreService.deleteStore(store.id); // Assuming deleteStore is defined in StoreService
          setStores((prevStores) => prevStores.filter((s) => s.id !== store.id));
          Swal.fire("Deleted!", "The store has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "There was a problem deleting the store.", "error");
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

  const { logout } = useAuthContext();
  const handleLogout = () => {
    logout();
    Swal.fire({
      title: "Logout Success",
      text: "You have successfully logged out.",
      icon: "success",
      confirmButtonText: "OK",
    });
    //navigate("/"); // Uncomment this line if you want to redirect after logout
  };

  return (
    <>
      <div>
        <h1>Store Delivery Zone Checker</h1>
        <button
          className="btn btn-primary bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white hover:scale-105 transition-transform duration-300"
          onClick={handleGetLocation}
        >
          Get My Location
        </button>
        <button
          className="btn btn-primary bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white hover:scale-105 transition-transform duration-300"
          onClick={handleLocationCheck}
        >
          Check Delivery Availability
        </button>
        <button
          className="btn btn-primary bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white hover:scale-105 transition-transform duration-300"

        >
          <a onClick={handleLogout}>Logout</a>
        </button>

        <div className="mapContainer">
          <MapContainer
            center={center}
            zoom={16}
            style={{ height: "75vh", width: "100vw" }}
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
                    isInDeliveryZone
                      ? inDeliveryZoneIcon
                      : outOfDeliveryZoneIcon
                  }
                  eventHandlers={{
                    click: () => handleStoreCheck(store),
                  }}
                >
                  <Popup>
                    <b>{store.storeName}</b>
                    <p>{store.address}</p>
                    <a href={store.direction}>Get Direction</a>
                    <button 
                      onClick={() => handleDelete(store)} 
                      style={{ marginTop: '10px', color: 'red' }}
                    >
                      Delete Store
                    </button>
                  </Popup>
                </Marker>
              );
            })}
            {activeStore && (
              <Circle
                center={[activeStore.latitude, activeStore.longitude]}
                radius={deliveryZone.radius}
                pathOptions={{
                  color: "blue",
                  fillColor: "blue",
                  fillOpacity: 0.2,
                }}
              />
            )}
            <LocationMap />
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
