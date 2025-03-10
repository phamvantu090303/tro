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
import { axiosInstance } from "../../../../Axios";
import { usePhongTro } from "../../../Context/PhongTroContext";
import RoomTable from "../../../component/admin/RoomTable";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import ModalMap from "../../../component/admin/ModalMap/ModalMap";
import { OpenModalForm } from "../../../Store/filterModalForm";
import { openConfirmModal } from "../../../Store/filterConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import ModalConFirm from "../../../component/ModalConfirm";

export default function MapAdmin() {
  const dispatch = useDispatch();
  const [locations, setLocations] = useState({});
  const [selectedState, setSelectedState] = useState({});
  const [states, setStates] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    latitude: 21.0285,
    longitude: 105.8542,
  });
  const [radius, setRadius] = useState(3000);
  const [filteredPhongTro, setFilteredPhongTro] = useState([]);
  const { phongTro } = usePhongTro();
  const [listDetailKhuvuc, setListDetailKhuvuc] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [idModal, setIdModal] = useState(null);
  const [idModal1, setIdModal1] = useState(null);
  const { isOpen, modalType } = useSelector((state) => state.ModalForm);

  const fetchMap = async () => {
    try {
      const res = await axiosInstance.get("/map/AllMap");
      if (!res.data || !res.data.data) {
        console.error("Invalid API response structure", res.data);
        return;
      }
      // Chuyển đổi dữ liệu để phù hợp với object { "ward": { "0": {...}, "1": {...} } }
      const locationData = res.data.data.reduce((acc, item) => {
        const { ward, latitude, longitude, ma_map, district, address, _id } =
          item;
        if (
          !ward ||
          typeof latitude !== "number" ||
          typeof longitude !== "number"
        )
          return acc;
        if (!acc[ward]) acc[ward] = {}; // Sử dụng object thay vì array
        const index = Object.keys(acc[ward]).length;
        acc[ward][index] = {
          latitude,
          longitude,
          ma_map,
          district,
          address,
          ward,
          _id,
        };
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
  useEffect(() => {
    fetchMap();
  }, []);

  useEffect(() => {
    if (!selectedState || !locations[selectedState]) return;
    const filteredPhongTro = Object.values(locations[selectedState]).filter(
      ({ latitude, longitude }) =>
        getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          mapCenter.latitude,
          mapCenter.longitude
        ) <= radius
    );

    setFilteredPhongTro(filteredPhongTro);
  }, [selectedState, locations, radius, phongTro, mapCenter]);
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

  const handleDetainMap = async (id) => {
    const res = await axiosInstance.post(`/phongTro/getPhongByMaMap/${id}`);
    setListDetailKhuvuc(res.data.data);
  };

  const handleConfirmModal = (id) => {
    setIdModal(id);
    dispatch(openConfirmModal({ modalType: "delete", id }));
  };
  const handleOpenModal = (item = null, id = null) => {
    setSelectedItem(item);
    setIdModal1(id);
    dispatch(OpenModalForm({ modalType: "edit", id: id ?? null }));
  };

  const handleOpenCreateModal = () => {
    dispatch(OpenModalForm({ modalType: "create", id: null }));
  };
  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null);
      setIdModal(null);
      setIdModal1(null);
    }
  }, [isOpen]);

  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Tên phòng trọ", key: "ten_phong_tro" },
    { label: "Mã danh mục", key: "ma_danh_muc" },
    { label: "Số người", key: "so_luong_nguoi" },
    { label: "Trạng thái", key: "trang_thai" },
    { label: "Mô tả", key: "mo_ta" },
  ];

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex justify-between gap-10">
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            Quản lý khu vực phòng trọ Admin
          </h2>
          <div className="flex space-x-2 mb-4 gap-10">
            <div className="flex gap-5 items-center">
              <p className="text-xl">Khu vực</p>
              <select
                value={selectedState}
                onChange={(e) => {
                  const newState = e.target.value;
                  setSelectedState(newState);
                  setMapCenter(locations[newState]["0"]);
                }}
                className="px-4 py-2 text-lg rounded-lg border border-gray-300 text-gray-600"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-5">
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
            <div>
              <button
                className="py-3 px-5 bg-slate-900 text-white rounded-lg"
                onClick={() => handleOpenCreateModal()}
              >
                Thêm map
              </button>
            </div>
          </div>

          <div className="border border-gray-500 rounded-lg max-h-[300px] overflow-auto">
            <div className="grid grid-cols-5 gap-5 mb-5 bg-gray-300 rounded-t-lg py-2 px-5">
              <p className="text-lg font-medium ">Mã map</p>
              <p className="text-lg font-medium">Đường</p>
              <p className="text-lg font-medium">Quận/Huyện</p>
              <p className="text-lg font-medium">Thành phố</p>
              <p className="text-lg font-medium">Action</p>
            </div>
            <ul className="space-y-4 overflow-auto max-h-[490px]">
              {locations[selectedState] &&
                Object.values(locations[selectedState]).map((item, index) => (
                  <li
                    className="grid grid-cols-5 gap-5 bg- cursor-pointer py-2 px-5 "
                    key={index}
                    onClick={() => handleDetainMap(item.ma_map)}
                  >
                    <p className="text-lg font-normal">{item.ma_map}</p>
                    <p className="text-lg font-normal">{item.address}</p>
                    <p className="text-lg font-normal">{item.district}</p>
                    <p className="text-lg font-normal">{item.ward}</p>
                    <div className="flex gap-5">
                      <FaRegEdit
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(item, item._id);
                        }}
                      />

                      <MdDeleteOutline
                        size={25}
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmModal(item._id);
                        }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="w-1/2 border border-gray-500">
          <MapContainer
            center={[mapCenter.latitude, mapCenter.longitude]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className=""
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
                  <p>
                    Đường : {pt.address},{pt.district}, {pt.ward}
                  </p>
                  <p
                    className="text-blue-500 font-medium cursor-pointer"
                    onClick={() => handleDetainMap(pt.ma_map)}
                  >
                    Xem danh sách phòng ở {pt.address}
                  </p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      {listDetailKhuvuc ? (
        <RoomTable
          displayedRooms={listDetailKhuvuc}
          roomsPerPage={5}
          title={"Bản đồ"}
          headers={headers}
        />
      ) : (
        <div></div>
      )}

      {isOpen && (
        <ModalMap data={selectedItem} id={idModal1} reload={fetchMap} />
      )}

      {idModal && <ModalConFirm id={idModal} reload={fetchMap} />}
    </div>
  );
}
