import { useEffect, useState } from "react";
import SearchBar from "../../../../component/admin/SearchBar";
import { axiosInstance } from "../../../../../Axios";
import RoomTable from "../../../../component/admin/RoomTable";

function YeuThichAdmin() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);

  const headers = [
    { label: "Mã phòng", key: "ma_phong" },
    { label: "ID user", key: "id_user" },
  ];
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/yeu-thich/getAll");
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex gap-5 ">
        <SearchBar />
      </div>
      <RoomTable
        title={"Yêu thích"}
        headers={headers}
        displayedRooms={data}
        roomsPerPage={5}
      />
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
  );
}

export default YeuThichAdmin;
