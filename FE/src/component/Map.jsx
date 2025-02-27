import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { axiosInstance } from "../../Axios";

export default function DiscoverSouthernIndia() {
  const [locations, setLocations] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [states, setStates] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    latitude: 21.0285,
    longitude: 105.8542,
  });
  const [radius, setRadius] = useState(3000);
  const [filteredPhongTro, setFilteredPhongTro] = useState([]);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await axiosInstance.get("/map/AllMap");

        if (!res.data || !res.data.data) {
          console.error("Invalid API response structure", res.data);
          return;
        }

        // Chuyển đổi dữ liệu để phù hợp với object `{ "ward": { "0": {...}, "1": {...} } }`
        const locationData = res.data.data.reduce((acc, item) => {
          const { ward, latitude, longitude } = item;

          if (
            !ward ||
            typeof latitude !== "number" ||
            typeof longitude !== "number"
          )
            return acc;

          if (!acc[ward]) acc[ward] = {}; // Sử dụng object thay vì array
          const index = Object.keys(acc[ward]).length;
          acc[ward][index] = { latitude, longitude };

          return acc;
        }, {});

        setLocations(locationData);
        setStates(Object.keys(locationData));

        if (Object.keys(locationData).length > 0) {
          const firstState = Object.keys(locationData)[0];
          setSelectedState(firstState);
          setMapCenter(locationData[firstState]["0"]);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchMap();
  }, []);

  useEffect(() => {
    if (!selectedState || !locations[selectedState]) return;

    const filtered = Object.values(locations[selectedState]).filter(
      ({ latitude, longitude }) => {
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          mapCenter.latitude,
          mapCenter.longitude
        );
        return distance <= radius;
      }
    );

    setFilteredPhongTro(filtered);
  }, [selectedState, locations, radius]);

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function ChangeMapCenter({ center }) {
    const map = useMap();
    map.setView([center.latitude, center.longitude], 12);
    return null;
  }

  return (
    <div className="p-6 w-full mx-auto flex gap-6">
      <div className="w-1/2">
        <h2 className="text-3xl font-bold mb-4">Discover Southern India</h2>

        <div className="flex space-x-2 mb-4">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => {
                setSelectedState(state);
                setMapCenter(locations[state]["0"]);
              }}
              className={`px-4 py-2 text-sm rounded-full border ${
                selectedState === state
                  ? "bg-blue-600 text-white"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="text-gray-600 text-sm">Bán kính:</span>
          <select
            className="border border-gray-300 rounded px-3 py-1"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            <option value={1000}>1 km</option>
            <option value={3000}>3 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
          </select>
        </div>

        {selectedState && (
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-bold">{selectedState}</h3>
            <p className="text-gray-600 text-sm mt-2">
              "Explore {selectedState} and find amazing rental options!"
            </p>
          </div>
        )}
      </div>

      <div className="w-full">
        <MapContainer
          center={[mapCenter.latitude, mapCenter.longitude]}
          zoom={12}
          style={{ height: "700px", width: "100%" }}
        >
          <ChangeMapCenter center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Vòng tròn bán kính */}
          {selectedState &&
            locations[selectedState] &&
            (() => {
              const wardLocations = Object.values(locations[selectedState]);

              if (wardLocations.length === 0) return null;

              const avgLat =
                wardLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
                wardLocations.length;
              const avgLon =
                wardLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
                wardLocations.length;

              return (
                <Circle
                  center={[avgLat, avgLon]}
                  radius={radius}
                  color="blue"
                  fillColor="blue"
                  fillOpacity={0.2}
                />
              );
            })()}

          {/* Hiển thị phòng trọ trong vùng bán kính */}
          {filteredPhongTro.map((pt, index) => (
            <Marker key={index} position={[pt.latitude, pt.longitude]}>
              <Popup>
                <strong>Phòng Trọ</strong>
                <p>
                  Tọa độ: {pt.latitude}, {pt.longitude}
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
