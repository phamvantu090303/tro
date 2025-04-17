import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import SearchBar from "../../../../component/admin/SearchBar";
import { axiosInstance } from "../../../../../Axios";

function SuachuaAdmin() {
  const {
    data: suachua,

    DeleteData,
    fetchData,
  } = useApiManagerAdmin("/sua_chua");

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
    </div>
  );
}

export default SuachuaAdmin;
