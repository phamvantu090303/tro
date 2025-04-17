import { useEffect, useState } from "react";
import SearchBar from "../../../../component/admin/SearchBar";
import RoomTable from "../../../../component/admin/RoomTable";
import { usePhongTro } from "../../../../Context/PhongTroContext";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseModalForm,
  OpenModalForm,
} from "../../../../Store/filterModalForm";

function ThietBiAdmin() {
  const [dataThietbi, setDataThietbi] = useState({
    ma_phong: "",
    ten_thiet_bi: "",
    so_luong_thiet_bi: "",
    trang_thai: 0,
  });
  const { phongTro } = usePhongTro();
  const { modalType, idModal, isOpen } = useSelector(
    (state) => state.ModalForm
  );
  const dispatch = useDispatch();
  const {
    data: thietBi,
    createData,
    DeleteData,
    DeleteAllData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/thiet-bi");

  useEffect(() => {
    fetchData();
  }, []);

  const headers = [
    {
      label: "Mã phòng",
      key: "ma_phong",
    },
    {
      label: "Tên thiết bị",
      key: "ten_thiet_bi",
    },
    {
      label: "Số lượng thiết bị",
      key: "so_luong_thiet_bi",
    },
    {
      label: "Trạng thái",
      key: "trang_thai",
    },
  ];

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

  const resetData = () => {
    setDataThietbi({
      ma_phong: "",
      ten_thiet_bi: "",
      so_luong_thiet_bi: "",
      trang_thai: 0,
    });
    dispatch(CloseModalForm());
  };

  const handleCreateThietbi = async () => {
    await createData({
      ma_phong: dataThietbi.ma_phong,
      ten_thiet_bi: dataThietbi.ten_thiet_bi,
      so_luong_thiet_bi: dataThietbi.so_luong_thiet_bi,
      trang_thai: dataThietbi.trang_thai,
    });
  };
  const handleOpenModalEdit = async (room) => {
    setDataThietbi({
      ma_phong: room.ma_phong,
      ten_thiet_bi: room.ten_thiet_bi,
      so_luong_thiet_bi: room.so_luong_thiet_bi,
      trang_thai: room.trang_thai,
    });
    dispatch(OpenModalForm({ modalType: "edit", id: room._id ?? null }));
  };
  const handleDeleteAll = async () => {
    await DeleteAllData();
  };

  // Xóa một danh mục sử dụng DeleteData từ hook
  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  //update sử dụng updaatData từ hook
  const handleUpdateTrangThai = async (id, value) => {
    await UpdateData(id, { trang_thai: value });
  };
  const handleCreate = async () => {
    if (modalType === "create") {
      await handleCreateThietbi();
    } else if (modalType === "edit") {
      await UpdateData(idModal, dataThietbi);
    }
    resetData();
  };
  return (
    <div>
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-customBlue text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() =>
            dispatch(OpenModalForm({ modalType: "create", id: null }))
          }
        >
          Thêm thiết bị
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
        title={"Thiết bị"}
        displayedRooms={thietBi}
        roomsPerPage={10}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        handleOpenModalEdit={handleOpenModalEdit}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "create"
                  ? "Thêm thiết bị"
                  : "Chỉnh sửa thiết bị"}{" "}
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={resetData}
              >
                Close
              </button>
            </div>
            <div className="space-y-5  mt-4">
              <div className="flex gap-5">
                <select
                  className="border py-3 px-5 rounded-md w-full border-gray-500"
                  onChange={(e) =>
                    setDataThietbi((prevData) => ({
                      ...prevData,
                      ma_phong: e.target.value,
                    }))
                  }
                  value={dataThietbi.ma_phong}
                >
                  <option value="">Chọn mã phòng</option>
                  {phongTro.map((dm) => (
                    <option key={dm.ma_phong} value={dm.ma_phong}>
                      {dm.ma_phong}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) =>
                    setDataThietbi((prevData) => ({
                      ...prevData,
                      ten_thiet_bi: e.target.value,
                    }))
                  }
                  className="border py-3 px-5 rounded-md w-full  border-gray-500"
                  value={dataThietbi.ten_thiet_bi}
                >
                  <option value="">Chọn thiết bị</option>
                  <option value="Quạt hơi nước">Quạt hơi nước</option>
                  <option value="Điều hòa">Điều hòa</option>
                  <option value="Tủ lạnh">Tủ lạnh</option>
                  <option value="Máy giặt">Máy giặt</option>
                  <option value="Bình nóng lạnh">Bình nóng lạnh</option>
                  <option value="Bếp gas">Bếp gas</option>
                  <option value="Lò vi sóng">Lò vi sóng</option>
                  <option value="Nồi cơm điện">Nồi cơm điện</option>
                  <option value="Ấm đun nước">Ấm đun nước</option>
                  <option value="Máy lọc nước">Máy lọc nước</option>
                  <option value="Tủ quần áo">Tủ quần áo</option>
                  <option value="Giường">Giường</option>
                  <option value="Bàn ghế">Bàn ghế</option>
                  <option value="Kệ sách">Kệ sách</option>
                  <option value="Đèn ngủ">Đèn ngủ</option>
                  <option value="Tivi">Tivi</option>
                  <option value="Wifi">Wifi</option>
                  <option value="Loa Bluetooth">Loa Bluetooth</option>
                  <option value="Rèm cửa">Rèm cửa</option>
                  <option value="Ban công">Ban công</option>
                  <option value="Máy chiếu">Máy chiếu</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Số lượng thiết bị"
                className="py-3 px-5 border border-gray-500 rounded-lg"
                onChange={(e) =>
                  setDataThietbi((prevData) => ({
                    ...prevData,
                    so_luong_thiet_bi: e.target.value,
                  }))
                }
                value={dataThietbi.so_luong_thiet_bi}
              />
              <select
                onChange={(e) =>
                  setDataThietbi((prevData) => ({
                    ...prevData,
                    trang_thai: e.target.value,
                  }))
                }
                className="border bg-white border-gray-300 px-3 py-3 rounded-lg w-[60%]"
                value={dataThietbi.trang_thai}
              >
                <option value="">Chọn trạng thái</option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="mt-10 py-2 px-10 bg-customBlue rounded-lg text-white"
            >
              {modalType === "create" ? "Thêm" : "Chỉnh sửa"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThietBiAdmin;
