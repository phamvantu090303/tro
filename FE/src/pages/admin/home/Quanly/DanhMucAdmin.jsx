import { useEffect, useState } from "react";
import SearchBar from "../../../../component/admin/SearchBar";
import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseModalForm,
  OpenModalForm,
} from "../../../../Store/filterModalForm";

function DanhMucAdmin() {
  const [dataDanhmuc, setDataDanhmuc] = useState({
    ma_danh_muc: "",
    ten_danh_muc: "",
    mo_ta: "",
    trang_thai: "",
  });
  const { modalType, idModal, isOpen } = useSelector(
    (state) => state.ModalForm
  );
  const dispatch = useDispatch();
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

  const resetData = () => {
    dispatch(CloseModalForm());
    setDataDanhmuc({
      ma_danh_muc: "",
      ten_danh_muc: "",
      mo_ta: "",
      trang_thai: "",
    });
  };

  // Tạo danh mục mới sử dụng createData từ hook
  const handleCreateDanhMuc = async () => {
    await createData({
      ma_danh_muc: dataDanhmuc.ma_danh_muc,
      ten_danh_muc: dataDanhmuc.ten_danh_muc,
      trang_thai: dataDanhmuc.trang_thai,
      mo_ta: dataDanhmuc.mo_ta,
    });
    resetData();
  };

  const handleDeleteAll = async () => {
    await DeleteAllData();
  };

  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  const handleOpenModalEdit = (value) => {
    dispatch(OpenModalForm({ modalType: "edit", id: value._id ?? null }));
    setDataDanhmuc({
      ma_danh_muc: value.ma_danh_muc,
      ten_danh_muc: value.ten_danh_muc,
      trang_thai: value.trang_thai,
      mo_ta: value.mo_ta,
    });
  };

  const handleCreate = async () => {
    if (modalType === "create") {
      await handleCreateDanhMuc();
    } else if (modalType === "edit") {
      await UpdateData(idModal, dataDanhmuc);
    }
    resetData();
  };
  return (
    <div className="">
      <div className="flex gap-5">
        <SearchBar />
        <button
          className="bg-customBlue text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() => {
            dispatch(OpenModalForm({ modalType: "create", id: null }));
          }}
        >
          {modalType === "edit" ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
        </button>
        <button
          className="bg-red-600 text-white p-3 rounded-lg hover:bg-sky-600"
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
        handleOpenModalEdit={handleOpenModalEdit}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">Thêm danh mục</h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={resetData} // Sửa null thành false
              >
                Đóng
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex gap-5">
                <input
                  type="text"
                  placeholder="Mã danh mục"
                  value={dataDanhmuc.ma_danh_muc}
                  onChange={(e) =>
                    setDataDanhmuc((setPrev) => ({
                      ...setPrev,
                      ma_danh_muc: e.target.value,
                    }))
                  }
                  className="py-3 px-5 border border-gray-500 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={dataDanhmuc.mo_ta}
                  onChange={(e) =>
                    setDataDanhmuc((setPrev) => ({
                      ...setPrev,
                      mo_ta: e.target.value,
                    }))
                  }
                  className="py-3 px-5 border border-gray-500 rounded-lg"
                />
              </div>
              <select
                value={dataDanhmuc.trang_thai}
                onChange={(e) =>
                  setDataDanhmuc((setPrev) => ({
                    ...setPrev,
                    trang_thai: e.target.value,
                  }))
                }
                className="border bg-white border-gray-300 px-3 py-3 rounded-lg w-[60%]"
              >
                <option value="" disabled>
                  Chọn trạng thái
                </option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
              <OptionDanhMuc
                value={dataDanhmuc.ten_danh_muc}
                setTenDanhMuc={(value) =>
                  setDataDanhmuc((prev) => ({ ...prev, ten_danh_muc: value }))
                }
              />
            </div>
            <button
              onClick={handleCreate}
              className="py-2 px-7 text-white bg-customBlue rounded-lg mt-4"
            >
              {modalType === "edit" ? "Chỉnh sửa" : "Thêm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DanhMucAdmin;
