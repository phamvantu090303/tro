import { useState } from "react";
import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import SearchBar from "../../../../component/admin/SearchBar";
import { axiosInstance } from "../../../../../Axios";

function SuachuaAdmin() {
  const {
    data: suachua,
    createData,
    DeleteData,
    fetchData,
  } = useApiManagerAdmin("/sua_chua");
  const [data, setData] = useState({
    tien_dien: 0,
    tien_nuoc: 0,
    tien_wifi: 0,
  });
  const headers = [
    { label: "Tên", key: "userName" },
    { label: "Mã phòng", key: "ma_phong" },
    { label: "Lý do", key: "issue" },
    { label: "Trạng thái", key: "status" },
    { label: "Phê duyệt", key: "approved" },
    { label: "Ngày báo cáo", key: "createdAt" },
  ];
  const handleUpdateTrangThai = async (id, value) => {
    await axiosInstance.post(`/sua_chua/UpdateStatus/${id}`, {
      status: value,
    });
    fetchData();
  };

  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };
  const renderStatus = (status) => {
    return (
      <select
        value={status.status}
        className="p-1 border rounded"
        onChange={(e) => handleUpdateTrangThai(status._id, e.target.value)}
      >
        {["Chờ xử lý", "Đang xử lý", "Hoàn thành"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="flex gap-5 ">
        <SearchBar />
      </div>
      <RoomTable
        title={"Sửa chữa"}
        headers={headers}
        displayedRooms={suachua}
        roomsPerPage={5}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        // handleOpenModalEdit={handleOpenModalEdit}
      />
      {/* {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] w-1/4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "edit" ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <p className="text-lg">Tiền điện</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền điện"
                  value={data.tien_dien}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_dien: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <p className="text-lg">Tiền nước</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền nước"
                  value={data.tien_nuoc}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_nuoc: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <p className="text-lg">Tiền wifi</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền wifi"
                  value={data.tien_wifi}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_wifi: e.target.value,
                    }))
                  }
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
      )} */}
    </div>
  );
}

export default SuachuaAdmin;
