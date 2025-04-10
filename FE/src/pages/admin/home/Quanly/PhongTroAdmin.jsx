import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../../Axios";
import RoomTable from "../../../../component/admin/RoomTable";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDanhMuc } from "../../../../Context/DanhMucContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "../../../../component/admin/SearchBar";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";

function PhongTroAdmin() {
  const [chucnang, setChucnang] = useState("Tất cả các phòng");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const { danhMuc } = useDanhMuc();
  const [maps, setMaps] = useState([]);
  const [hienthiAnh, setHienthiAnh] = useState([]);
  const [phongTroMoi, setPhongTroMoi] = useState({
    maPhong: "",
    maMap: "",
    madanhmuc: "",
    tenPhongtro: "",
    mota: "",
    dientich: "",
    giatien: "",
    trangthai: "",
    soLuongnguoi: "",
    diachi: "",
  });
  const {
    data: phongTro,
    createData,
    DeleteData,
    DeleteAllData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/phongTro");
  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Tên phòng trọ", key: "ten_phong_tro" },
    { label: "Mã danh mục", key: "ma_danh_muc" },
    { label: "Số người", key: "so_luong_nguoi" },
    { label: "Trạng thái", key: "trang_thai" },
    { label: "Mô tả", key: "mo_ta" },
  ];

  useEffect(() => {
    const fetchDataMapandDanhMuc = async () => {
      try {
        const resMap = await axiosInstance.get("/map/AllMap");
        setMaps(resMap.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataMapandDanhMuc();
  }, [chucnang]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhongTroMoi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = async (event) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setHienthiAnh((prevImages) => [...prevImages, ...previewArray]);
      setImages((prevImages) => [...prevImages, ...fileArray]);
    }
  };

  const upload = async (files) => {
    const CLOUD_NAME = "dlvf2ltdx";
    const PRESET_NAME = "uploadimages";
    const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
    const FOLDER_NAME = "PHONGTRO";
    const urls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("upload_preset", PRESET_NAME);
      formData.append("folder", FOLDER_NAME);
      formData.append("file", file);

      const resourceType = file.type.includes("video") ? "video" : "image";
      try {
        const response = await axios.post(
          `${API_URL}/${resourceType}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        urls.push(response.data.secure_url);
      } catch (error) {
        console.error(`Lỗi upload ${resourceType}:`, error);
      }
    }
    return urls;
  };

  const handleCreateRoom = async () => {
    const urlsImg = await upload(images);
    if (!urlsImg.length) {
      toast.error("Không có ảnh để tạo phòng!");
      return;
    }

    await createData({
      ma_phong: phongTroMoi.maPhong,
      ma_map: phongTroMoi.maMap,
      anh_phong: urlsImg.join(", "),
      ma_danh_muc: phongTroMoi.madanhmuc,
      ten_phong_tro: phongTroMoi.tenPhongtro,
      mo_ta: phongTroMoi.mota,
      dia_chi: phongTroMoi.diachi,
      dien_tich: phongTroMoi.dientich,
      gia_tien: Number(phongTroMoi.giatien),
      trang_thai: Number(phongTroMoi.trangthai),
      so_luong_nguoi: Number(phongTroMoi.soLuongnguoi),
    });
    setPage(1); // Quay lại trang danh sách
    setPhongTroMoi({
      // Reset form
      maPhong: "",
      maMap: "",
      madanhmuc: "",
      tenPhongtro: "",
      mota: "",
      dientich: "",
      giatien: "",
      trangthai: "",
      soLuongnguoi: "",
      diachi: "",
    });
    setImages([]);
    setHienthiAnh([]);
  };

  const handleDelete = async (room) => {
    await DeleteData(room.ma_phong);
  };

  const filteredRooms = phongTro.filter((room) => {
    if (chucnang === "Phòng đã được thuê") return room.trang_thai === 0;
    if (chucnang === "Phòng trống") return room.trang_thai === 1;
    return true;
  });

  return (
    <div className="p-4 w-full">
      {page === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Room</h2>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {["Tất cả các phòng", "Phòng trống", "Phòng đã được thuê"].map(
                (label) => (
                  <p
                    key={label}
                    className={`text-lg py-2 px-4 cursor-pointer ${
                      chucnang === label
                        ? "font-medium border-b-2 border-gray-500"
                        : ""
                    }`}
                    onClick={() => setChucnang(label)}
                  >
                    {label}
                  </p>
                )
              )}
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
              <button
                className="text-base bg-red-500 text-white rounded-full py-2 px-3"
                onClick={() => setPage(2)}
              >
                + Thêm phòng trọ
              </button>
            </div>
          </div>
          <RoomTable
            displayedRooms={filteredRooms}
            roomsPerPage={10}
            title="Tất cả phòng trọ"
            headers={headers}
            handleDelete={handleDelete}
          />
        </div>
      )}
      {page === 2 && (
        <div className="space-y-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setPage(1)}
          >
            <IoMdArrowRoundBack size={25} />
            <h2 className="text-2xl font-bold">Thêm phòng trọ</h2>
          </div>

          {/* Ảnh */}
          <div>
            <p className="text-xl font-medium mb-4">Ảnh phòng</p>
            <div className="flex space-x-2 overflow-x-auto">
              {hienthiAnh.map((src, index) => (
                <img
                  src={src}
                  key={index}
                  alt={`Uploaded ${index}`}
                  className="w-[200px] h-[120px] object-contain"
                />
              ))}
              <label className="w-[200px] h-[120px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer">
                Add image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddImage}
                />
              </label>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Chi tiết phòng */}
          <div>
            <p className="text-xl font-medium mb-4">Chi tiết phòng</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Mã phòng", name: "maPhong", type: "text" },
                { label: "Tên phòng", name: "tenPhongtro", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <p>{label}</p>
                  <input
                    type={type}
                    name={name}
                    placeholder={label}
                    className="border p-2 rounded-md w-full mt-2"
                    value={phongTroMoi[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div>
                <p>Mã map</p>
                <select
                  className="border p-2 rounded-md w-full mt-2"
                  value={phongTroMoi.maMap}
                  onChange={handleChange}
                  name="maMap"
                >
                  <option value="">-- Chọn mã map--</option>
                  {maps.map((dm) => (
                    <option key={dm.ma_map} value={dm.ma_map}>
                      {dm.ma_map}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p>Trạng thái</p>
                <select
                  className="border p-2 rounded-md w-full mt-2"
                  value={phongTroMoi.trangthai}
                  onChange={handleChange}
                  name="trangthai"
                >
                  <option value={0}>Đã cho thuê</option>
                  <option value={1}>Còn trống</option>
                  <option value={2}>Đang sửa chữa</option>
                </select>
              </div>

              <div>
                <p>Danh mục</p>
                <select
                  className="border p-2 rounded-md w-full mt-2"
                  value={phongTroMoi.madanhmuc}
                  onChange={handleChange}
                  name="madanhmuc"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {danhMuc.map((dm) => (
                    <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                      {dm.ten_danh_muc}
                    </option>
                  ))}
                </select>
              </div>

              {[
                { label: "Số người", name: "soLuongnguoi" },
                { label: "Giá tiền", name: "giatien" },
                { label: "Diện tích", name: "dientich" },
                { label: "Địa chỉ", name: "diachi" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <p>{label}</p>
                  <input
                    type="text"
                    placeholder={label}
                    className="border p-2 rounded-md w-full mt-2"
                    name={name}
                    value={phongTroMoi[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <textarea
                placeholder="Mô tả phòng"
                className="border p-2 rounded-md w-full mt-2 col-span-1 md:col-span-2"
                name="mota"
                value={phongTroMoi.mota}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Thiết bị */}
          <div>
            <p className="text-xl font-medium mb-4">Thiết bị</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Thêm checkbox nếu bạn có mảng amenities */}
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="py-4 px-10 rounded-lg bg-indigo-950 text-white text-xl font-bold"
          >
            Tạo phòng
          </button>
        </div>
      )}
    </div>
  );
}

export default PhongTroAdmin;
