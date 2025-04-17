import { useDispatch, useSelector } from "react-redux";
import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import SearchBar from "../../../../component/admin/SearchBar";
import {
  CloseModalForm,
  OpenModalForm,
} from "../../../../Store/filterModalForm";
import { useState } from "react";

function HoadonThangAdmin() {
  const [data, setData] = useState({
    ma_phong: "",
    id_users: "",
    ngay_tao_hoa_don: "",
  });
  const { modalType, idModal, isOpen } = useSelector(
    (state) => state.ModalForm
  );
  const dispatch = useDispatch();
  const {
    data: hdThang,
    createData,
    UpdateData,
    DeleteData,
  } = useApiManagerAdmin("/hoa-don-thang");

  const handleDelete = async (value) => {
    await DeleteData(value._id);
  };
  const handleCreate = async () => {
    if (modalType === "create") {
      await createData(data);
    } else if (modalType === "edit") {
      await UpdateData(idModal, data);
    }
  };
  const handleOpenModalEdit = async (room) => {
    dispatch(OpenModalForm({ modalType: "edit", id: room._id ?? null }));
  };
  const headers = [
    { label: "Tên user", key: "ho_va_ten" },
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Tổng tiền", key: "tong_tien" },
    { label: "Trạng thái", key: "trang_thai" },
    { label: "ngày tạo hóa đơn", key: "ngay_tao_hoa_don" },
  ];
  const handleClose = () => {
    dispatch(CloseModalForm());
  };
  const renderStatus = (status) => {
    return (
      <div>
        {status.trang_thai === "Đã thanh toán" ? (
          <p className="px-2 py-1 text-white text-sm rounded-lg bg-green-500">
            Đã thanh toán
          </p>
        ) : (
          <p className="px-2 py-2 text-white text-sm rounded-lg bg-red-500 w-[120px]">
            Chưa thanh toán
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() =>
            dispatch(OpenModalForm({ modalType: "create", id: null }))
          }
        >
          Thêm hóa đơn tháng
        </button>
      </div>
      <RoomTable
        title={"Hóa đơn tháng"}
        headers={headers}
        displayedRooms={hdThang}
        roomsPerPage={10}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        handleOpenModalEdit={handleOpenModalEdit}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "edit"
                  ? "Chỉnh sửa hóa đơn tháng"
                  : "Thêm hóa đơn tháng"}
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <form className="space-y-4">
              <div className="flex gap-5">
                <InputField
                  label="Mã phòng"
                  name="ma_phong"
                  value={data.ma_phong}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      ma_phong: e.target.value,
                    }))
                  }
                />
                <InputField
                  label="ID Người dùng"
                  name="id_users"
                  value={data.id_users}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      id_users: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-semibold">Ngày tạo hóa đơn:</label>
                <input
                  type="date"
                  value={data.ngay_tao_hoa_don}
                  onChange={(e) =>
                    setData({ ...data, ngay_tao_hoa_don: e.target.value })
                  }
                  className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
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
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
}) => (
  <div>
    <label className="block font-semibold">{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
export default HoadonThangAdmin;
