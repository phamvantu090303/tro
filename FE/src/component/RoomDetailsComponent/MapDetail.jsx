import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function MapDetail({ toado }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  const handleGetMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          alert("Không thể lấy vị trí của bạn!");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị!");
    }
  };

  return (
    <div>
      <div className="bg-gray-200 py-6 px-6 flex items-center justify-center w-[70%] mx-auto rounded-xl">
        <div className="bg-white py-6 px-6 flex items-center justify-center w-[100%] mx-auto rounded-xl">
          <MapContainer
            key={toado}
            center={toado}
            zoom={16}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {currentLocation && (
              <Marker position={currentLocation}>
                <Popup>Vị trí của tôi</Popup>
              </Marker>
            )}
            <Marker position={toado}>
              <Popup>{toado}</Popup>
            </Marker>
            {showRoute && currentLocation && (
              <RoutingControl start={currentLocation} end={toado} />
            )}
          </MapContainer>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-6">
        <button
          onClick={handleGetMyLocation}
          className="bg-[#23284C] font-medium py-3 px-8 text-white rounded-md"
        >
          Địa chỉ của tôi
        </button>
        <button
          onClick={() => setShowRoute(true)}
          className="bg-[#23284C] font-medium py-3 px-8 text-white rounded-md"
        >
          Vẽ đường đi
        </button>
      </div>
    </div>
  );
}

function RoutingControl({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routes: () => null,
      createMarker: () => null, // Không hiển thị marker
      showAlternatives: false, // Tắt tuyến đường thay thế
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
}

export default MapDetail;
