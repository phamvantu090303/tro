import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../Axios";
import RoomTable from "../../../component/admin/RoomTable";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDanhMuc } from "../../../Context/DanhMucContext";
import { usePhongTro } from "../../../Context/PhongTroContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

function PhongTroAdmin() {
  const [chucnang, setChucnang] = useState("Tất cả các phòng");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const { phongTro } = usePhongTro();
  const [dataPhongtro, setDataPhongtro] = useState([]);
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

  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Tên phòng trọ", key: "ten_phong_tro" },
    { label: "Mã danh mục", key: "ma_danh_muc" },
    { label: "Số người", key: "so_luong_nguoi" },
    { label: "Trạng thái", key: "trang_thai" },
    { label: "Mô tả", key: "mo_ta" },
  ];

  useEffect(() => {
    try {
      const fetchDataMapandDanhMuc = async () => {
        const resMap = await axiosInstance.get("/map/AllMap");
        setMaps(resMap.data.data);
      };
      fetchDataMapandDanhMuc();
      if (phongTro.length > 0) {
        const sortedBooks = [...phongTro].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataPhongtro(sortedBooks);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chucnang]);

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
      console.log(file);
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
        console.log("response", response);
        urls.push(response.data.secure_url);
      } catch (error) {
        console.error(`Lỗi upload ${resourceType}:`, error);
      }
    }
    return urls;
  };

  const handleCreateRoom = async () => {
    try {
      const urlsImg = await upload(images);
      console.log("urlsImg", urlsImg);
      if (!urlsImg) {
        return "Khong co anh de tao phong";
      }
      await axiosInstance.post("/phongTro/create", {
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
      setTimeout(() => {
        toast.success("Đã tạo thêm phòng trọ thành công");
        setPage(1);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRooms = dataPhongtro.filter((room) => {
    if (chucnang === "Phòng đã được thuê") return room.trang_thai === 0;
    if (chucnang === "Phòng trống") return room.trang_thai === 1;
    return true;
  });

  return (
    <div className="flex h-full gap-3">
      {page === 1 && (
        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-2xl font-bold">Room</h2>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Tất cả các phòng"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => {
                  setChucnang("Tất cả các phòng");
                }}
              >
                Tất cả các phòng
              </p>
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Phòng trống"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => {
                  setChucnang("Phòng trống");
                }}
              >
                Phòng trống
              </p>
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Phòng đã được thuê"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => setChucnang("Phòng đã được thuê")}
              >
                Phòng đã được thuê
              </p>
            </div>
            <SearchBar />
            <button
              className="text-base bg-red-500 text-white rounded-full py-2 px-3"
              onClick={() => setPage(2)}
            >
              + Thêm phòng trọ
            </button>
          </div>
          <RoomTable
            displayedRooms={filteredRooms}
            roomsPerPage={10}
            title="Tất cả phòng trọ"
            headers={headers}
          />
        </div>
      )}
      {page === 2 && (
        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <div className="flex items-center gap-5">
            <IoMdArrowRoundBack size={25} onClick={() => setPage(1)} />
            <h2 className="text-2xl font-bold">Thêm phòng trọ</h2>
          </div>
          <div className="mt-10">
            <div>
              <p className="text-xl font-medium mb-4">Ảnh phòng</p>

              <div className="flex space-x-2 w-full overflow-x-auto mt-4">
                {hienthiAnh.map((src, index) => (
                  <img
                    src={src}
                    key={index}
                    alt={`Uploaded ${index}`}
                    className="w-[200px] h-[120px] object-contain"
                  />
                ))}

                {/* Nút thêm ảnh */}
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
            <span className="block h-[1px] bg-gray-500 w-full my-4"></span>
            <div>
              <p className="text-xl font-medium mb-4">Chi tiết phòng</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-base">Mã phòng</p>
                  <input
                    type="text"
                    placeholder="Mã phòng"
                    name="maPhong"
                    className="border p-2 rounded-md w-full mt-2"
                    value={phongTroMoi.maPhong}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Tên phòng</p>
                  <input
                    type="text"
                    placeholder="Tên phòng"
                    name="tenPhongtro"
                    className="border p-2 rounded-md w-full mt-2"
                    value={phongTroMoi.tenPhongtro}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="text-base">Mã map</p>
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
                <div>
                  <p>Số người</p>
                  <input
                    type="text"
                    placeholder="Số lượng người ở"
                    className="border p-2 rounded-md w-full mt-2"
                    name="soLuongnguoi"
                    value={phongTroMoi.soLuongnguoi}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Giá tiền</p>
                  <input
                    type="text"
                    placeholder="Giá tiền"
                    className="border p-2 rounded-md w-full mt-2"
                    name="giatien"
                    value={phongTroMoi.giatien}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <p>Diện tích</p>
                  <input
                    type="text"
                    placeholder="Diện tích"
                    className="border p-2 rounded-md w-full mt-2"
                    name="dientich"
                    value={phongTroMoi.dientich}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="text-base">Địa chỉ</p>
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    name="diachi"
                    className="border p-2 rounded-md w-full mt-2"
                    value={phongTroMoi.diachi}
                    onChange={handleChange}
                  />
                </div>
                <textarea
                  placeholder="Mô tả phòng"
                  className="border p-2 rounded-md w-full mt-2 col-span-2"
                  name="mota"
                  value={phongTroMoi.mota}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <span className="block h-[1px] bg-gray-500 w-full my-4"></span>

            <div>
              <p>Thiết bị</p>
              <div className="grid grid-cols-4 gap-2">
                {/* {amenities.map((item, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </label>
                ))} */}
              </div>
            </div>
            <button
              onClick={handleCreateRoom}
              className="py-4 px-10 rounded-lg bg-indigo-950 text-white text-xl font-bold"
            >
              Tạo phòng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhongTroAdmin;
