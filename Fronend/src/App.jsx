import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
const base_url = import.meta.env.VITE_API_BASE_URL;
import "./App.css";

function App() {
  const center = [13.838514948417762, 100.02530203017818];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(base_url + "/api/stores");
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
           setMyLocation({ lat, lng });
           console.log("Clicked at latitue:" + lat + "longitude:" + lng);
         },
       });
     };
  
  

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };
return (
    <>
      <div>
        <h1>Store Delivery Zone Checker</h1>
        <button onClick={handleGetLocation}>Get My Location</button>
        <div className="mapContainer">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: "75vh", width: "100vw" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/** Display my location */}
            {myLocation.lat && myLocation.lng && (
              <Marker
                position={[myLocation.lat, myLocation.lng]}
                icon={L.icon({
                  iconUrl:
                    "https://cdn-icons-png.flaticon.com/128/6924/6924565.png",
                  iconSize: [35, 35],
                })}
              >
                <Popup>My current location.</Popup>
              </Marker>
            )}
            {stores.map((store, index) => (
              <Marker position={[store.lat, store.lng]} key={store.id}>
                <Popup>
                  <b>{store.name}</b>
                  <p>{store.address}</p>
                  <a href={store.direction}>Get Direction</a>
                </Popup>
              </Marker>
            ))}
           <LocationMap/>
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
