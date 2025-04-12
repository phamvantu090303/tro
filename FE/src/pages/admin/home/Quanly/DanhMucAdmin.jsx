import { useEffect, useState } from "react";
import SearchBar from "../../../../component/admin/SearchBar";
import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import OptionDanhMuc from "../../../../component/admin/OptionDanhMuc";
function DanhMucAdmin() {
  const [modal, setModal] = useState(false);
  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [maDanhMuc, setMaDanhMuc] = useState("");

  // Sử dụng hook useApiManagerAdmin với endpoint /danh-muc
  const {
    data: danhMuc,
    createData,
    DeleteData,
    DeleteAllData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/danh-muc");

  const headers = [
    { label: "Mã danh mục", key: "ma_danh_muc" },
    { label: "Mô tả", key: "mo_ta" },
    { label: "Tên danh mục", key: "ten_danh_muc" },
    { label: "Trạng thái", key: "trang_thai" },
  ];

  // Hàm render trạng thái
  const renderStatus = (status) => (
    <select
      value={status.trang_thai}
      className="p-1 border rounded"
      onChange={(e) => handleUpdateTrangThai(status._id, e.target.value)}
    >
      <option value={1}>Hoạt động</option>
      <option value={0}>Không hoạt động</option>
    </select>
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Cập nhật trạng thái sử dụng UpdateData từ hook
  const handleUpdateTrangThai = async (id, value) => {
    await UpdateData(id, { trang_thai: value });
  };

  // Tạo danh mục mới sử dụng createData từ hook
  const handleCreate = async () => {
    const success = await createData({
      ma_danh_muc: maDanhMuc,
      ten_danh_muc: tenDanhMuc,
      trang_thai: trangThai,
      mo_ta: moTa,
    });
    if (success) {
      setModal(false);
      setMaDanhMuc("");
      setTenDanhMuc("");
      setTrangThai("");
      setMoTa("");
    }
  };

  // Xóa tất cả danh mục sử dụng DeleteAllData từ hook
  const handleDeleteAll = async () => {
    await DeleteAllData();
  };

  // Xóa một danh mục sử dụng DeleteData từ hook
  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  return (
    <div className="space-y-10">
      <div className="flex gap-5">
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
        displayedRooms={danhMuc}
        roomsPerPage={10}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        updateTrangthai={handleUpdateTrangThai}
      />
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">Thêm danh mục</h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={() => setModal(false)} // Sửa null thành false
              >
                Đóng
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex gap-5">
                <input
                  type="text"
                  placeholder="Mã danh mục"
                  value={maDanhMuc}
                  onChange={(e) => setMaDanhMuc(e.target.value)}
                  className="py-3 px-5 border border-gray-500 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={moTa}
                  onChange={(e) => setMoTa(e.target.value)}
                  className="py-3 px-5 border border-gray-500 rounded-lg"
                />
              </div>
              <select
                value={trangThai}
                onChange={(e) => setTrangThai(e.target.value)}
                className="border bg-white border-gray-300 px-3 py-3 rounded-lg w-[60%]"
              >
                <option value="">Chọn trạng thái</option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
              <OptionDanhMuc setTenDanhMuc={setTenDanhMuc} />
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
  );
}

export default DanhMucAdmin;
