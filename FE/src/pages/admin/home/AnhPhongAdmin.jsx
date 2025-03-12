import { useEffect, useState } from "react";
import SearchBar from "../../admin/home/SearchBar";
import { axiosInstance } from "../../../../Axios";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import RoomTable from "../../../component/admin/RoomTable";

function AnhPhongAdmin() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/Image-phong/getAll");
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Ảnh phòng", key: "image_url" },
  ];

  return (
    <div className="flex h-screen gap-3">
      <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
        <div className="space-y-10">
          <div className="flex gap-5 ">
            <SearchBar />
            <button
              className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
              onClick={() => setModal(true)}
            >
              Thêm ảnh phòng
            </button>
            <button className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600">
              Xóa tất cả
            </button>
          </div>
          <RoomTable headers={headers} displayedRooms={data} roomsPerPage={5} />
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">
                  {modal === "edit" ? "Edit Admin" : "Create Admin"}
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
                  <input
                    type="text"
                    placeholder="Mã danh mục"
                    onChange={(e) => setMadanhmuc(e.target.value)}
                    className="py-3 px-5 border border-gray-500 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Mo ta"
                    onChange={(e) => setMota(e.target.value)}
                    className="py-3 px-5 border border-gray-500 rounded-lg"
                  />
                </div>
                <select
                  onChange={(e) => setTrangthai(e.target.value)}
                  className="border bg-white border-gray-300 px-3 py-3 rounded-lg w-[60%]"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
              <button onClick={handleCreate}>Tao</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnhPhongAdmin;
