import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
function MapDetail({ toado }) {
  if (!toado) {
    return <p>Không có dữ liệu vị trí</p>;
  }
  return (
    <MapContainer
      key={toado}
      center={toado}
      zoom={16}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      />
      <Marker position={toado}>
        <Popup>{toado}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapDetail;
