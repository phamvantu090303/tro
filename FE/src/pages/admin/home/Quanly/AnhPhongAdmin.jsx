import { useEffect, useState } from "react";
import SearchBar from "../../../../component/admin/SearchBar";
import { axiosInstance } from "../../../../../Axios";
import RoomTable from "../../../../component/admin/RoomTable";
import { usePhongTro } from "../../../../Context/PhongTroContext";
import { toast } from "react-toastify";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";

function AnhPhongAdmin() {
  const { phongTro } = usePhongTro();
  const [modal, setModal] = useState(false);
  const [maphong, setMaphong] = useState("");
  const [img, setImg] = useState("");
  const {
    data: anhphong,
    createData,
    DeleteData,
    DeleteAllData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/Image-phong");

  useEffect(() => {
    fetchData();
  }, []);

  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Ảnh phòng", key: "image_url" },
  ];

  const handleCreate = async () => {
    const success = await createData({
      ma_phong: maphong,
      image_url: img,
    });
    if (success) {
      setModal(false);
      setMaphong("");
      setImg("");
    }
  };

  const handleDeleteAll = async () => {
    await DeleteAllData();
  };

  // Xóa một danh mục sử dụng DeleteData từ hook
  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  return (
    <div className="space-y-10">
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() => setModal(true)}
        >
          Thêm ảnh phòng
        </button>
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </button>
      </div>
      <RoomTable
        title={"Ảnh phòng"}
        headers={headers}
        displayedRooms={anhphong}
        roomsPerPage={5}
        handleDelete={handleDelete}
      />
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                Thêm ảnh phòng chi tiết
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex gap-5">
                <select
                  className="border py-3 px-5 rounded-md w-full border-gray-500"
                  onChange={(e) => setMaphong(e.target.value)}
                  name="maMap"
                >
                  <option value="">Chọn mã phòng</option>
                  {phongTro.map((dm) => (
                    <option key={dm.ma_phong} value={dm.ma_phong}>
                      {dm.ma_phong}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="img url"
                  onChange={(e) => setImg(e.target.value)}
                  className="py-3 px-5 border border-gray-500 rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="mt-10 py-2 px-10 bg-customBlue rounded-lg text-white"
            >
              Tạo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnhPhongAdmin;
