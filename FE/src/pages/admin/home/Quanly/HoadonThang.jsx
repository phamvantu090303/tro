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
    id_user: "",
    chi_so_dien_thang_nay: 0,
    chi_so_dien_thang_truoc: 0,
    so_dien_tieu_thu: 0,
    tien_dien: 0,
    tien_phong: 0,
    dich_vu: "",
    tong_tien: 0,
    trang_thai: "",
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
    handleClose();
  };

  const handleOpenModalEdit = async (room) => {
    dispatch(OpenModalForm({ modalType: "edit", id: room._id ?? null }));
    setData({
      ma_phong: room.ma_phong,
      id_user: room.id_user,
      chi_so_dien_thang_nay: room.chi_so_dien_thang_nay,
      chi_so_dien_thang_truoc: room.chi_so_dien_thang_truoc,
      so_dien_tieu_thu: room.so_dien_tieu_thu,
      tien_dien: room.tien_dien,
      tien_phong: room.tien_phong,
      dich_vu: room.dich_vu,
      tong_tien: room.tong_tien,
      trang_thai: room.trang_thai,
      ngay_tao_hoa_don: room.ngay_tao_hoa_don,
    });
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
    setData({
      ma_phong: "",
      id_users: "",
      chi_so_dien_thang_nay: 0,
      chi_so_dien_thang_truoc: 0,
      so_dien_tieu_thu: 0,
      tien_dien: 0,
      tien_phong: 0,
      dich_vu: "",
      tong_tien: 0,
      trang_thai: "",
      ngay_tao_hoa_don: "",
    });
  };

  const renderStatus = (status) => {
    return (
      <div>
        {status.trang_thai === "đã thanh toán" ? (
          <p className="px-2 py-2 text-white text-sm rounded-lg bg-green-500 w-[120px]">
            đã thanh toán
          </p>
        ) : (
          <p className="px-2 py-2 text-white text-sm rounded-lg bg-red-500 w-[120px]">
            chưa thanh toán
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
            <div className="flex justify-between items-center w-full">
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
                  name="id_user"
                  value={data.id_user}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      id_user: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-5">
                <InputField
                  label="chỉ số điện tháng này"
                  name="chi_so_dien_thang_nay"
                  value={data.chi_so_dien_thang_nay}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      chi_so_dien_thang_nay: e.target.value,
                    }))
                  }
                />
                <InputField
                  label="chỉ số điện tháng trước"
                  name="chi_so_dien_thang_truoc"
                  value={data.chi_so_dien_thang_truoc}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      chi_so_dien_thang_truoc: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-5">
                <InputField
                  label="Số điện tiêu thụ"
                  name="so_dien_tieu_thu"
                  value={data.so_dien_tieu_thu}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      so_dien_tieu_thu: e.target.value,
                    }))
                  }
                />
                <InputField
                  label="Tiền điện"
                  name="tien_dien"
                  value={data.tien_dien}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      tien_dien: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-5 w-full">
                <InputField
                  label="Tổng tiền"
                  name="tong_tien"
                  value={data.tong_tien}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      tong_tien: e.target.value,
                    }))
                  }
                />
                <InputField
                  label="Tiền phòng"
                  name="tien_phong"
                  value={data.tien_phong}
                  onChange={(e) =>
                    setData((setPrev) => ({
                      ...setPrev,
                      tien_phong: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <select
                  name="trang_thai"
                  value={data.trang_thai}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      trang_thai: e.target.value,
                    }))
                  }
                  className="w-full border-gray-500 border p-1"
                >
                  <option value="đã thanh toán">đã thanh toán</option>
                  <option value="chưa thanh toán">chưa thanh toán</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold">Ngày tạo hóa đơn:</label>
                <input
                  type="date"
                  value={
                    data.ngay_tao_hoa_don
                      ? new Date(data.ngay_tao_hoa_don)
                          .toISOString()
                          .substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setData({
                      ...data,
                      ngay_tao_hoa_don: e.target.value,
                    })
                  }
                />
              </div>
            </form>
            <button
              onClick={handleCreate}
              className="mt-10 py-2 px-10 bg-customBlue rounded-lg text-white"
            >
              {modalType === "edit" ? "Chỉnh sửa" : "Tạo"}
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
  <div className="w-full">
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
