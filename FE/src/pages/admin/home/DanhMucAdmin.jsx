import { useEffect, useState } from "react";
import SearchBar from "../../admin/home/SearchBar";
import { axiosInstance } from "../../../../Axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Select } from "antd";
import OptionDanhMuc from "../../../component/Admin/OptionDanhMuc";
import RoomTable from "../../../component/admin/RoomTable";

function DanhMucAdmin() {
  const [danhmuc, setDanhmuc] = useState([]);
  const [modal, setModal] = useState(false);
  const [tendanhmuc, setTendanhmuc] = useState("");
  const [mota, setMota] = useState("");
  const [trangthai, setTrangthai] = useState("");
  const [madanhmuc, setMadanhmuc] = useState("");

  const headers = [
    { label: "Mã danh mục", key: "ma_danh_muc" },
    { label: "Mô tả", key: "mo_ta" },
    { label: "Tên danh mục", key: "ten_danh_muc" },
    { label: "Trạng thái", key: "trang_thai" },
  ];

  const renderStatus = (status) => (
    <select
      value={status}
      className="p-1 border rounded"
      onChange={(e) => console.log("Thay đổi trạng thái:", e.target.value)}
    >
      <option value={1}>Hoạt động</option>
      <option value={0}>Không hoạt động</option>
    </select>
  );

  const fetchReloadDanhMuc = async () => {
    try {
      const res = await axiosInstance.get("/danh-muc");
      setDanhmuc(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReloadDanhMuc();
  }, []);
  const handleUpdateTrangthai = async (id, value) => {
    try {
      await axiosInstance.post(`/danh-muc/update/${id}`, {
        trang_thai: value,
      });
      fetchReloadDanhMuc();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate = async () => {
    try {
      await axiosInstance.post("/danh-muc/create", {
        ma_danh_muc: madanhmuc,
        ten_danh_muc: tendanhmuc,
        trang_thai: trangthai,
        mo_ta: mota,
      });
      fetchReloadDanhMuc();
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAll = async () => {
    await axiosInstance.delete("/danh-muc/delete/all");
    fetchReloadDanhMuc();
  };
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
              Thêm danh mục
            </button>
            <button
              className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
              onClick={handleDeleteAll}
            >
              Xóa tất cả
            </button>
          </div>
          <RoomTable
            headers={headers}
            title={"Danh mục"}
            displayedRooms={danhmuc}
            roomsPerPage={10}
            renderStatus={renderStatus}
          />
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">Thêm danh mục</h2>
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
                <OptionDanhMuc setTendanhmuc={setTendanhmuc} />
              </div>
              <button
                onClick={handleCreate}
                className="py-2 px-7 text-white bg-customBlue rounded-lg mt-4"
              >
                Tạo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DanhMucAdmin;
