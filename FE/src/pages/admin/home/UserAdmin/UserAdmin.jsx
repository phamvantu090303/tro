import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../../Axios";
import RoomTable from "../../../../component/admin/RoomTable";
import { useNavigate } from "react-router";

function UserAdmin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAllUser = async () => {
      const res = await axiosInstance.get("/auth/AllUser");
      setData(res.data.data);
    };
    fetchAllUser();
  }, []);
  const headers = [
    { label: "UserName", key: "username" },
    { label: "Họ và tên", key: "ho_va_ten" },
    { label: "Email", key: "email" },
    { label: "Ngày sinh", key: "ngay_sinh" },
    { label: "Quê quán", key: "que_quan" },
    { label: "Số điện thoại", key: "so_dien_thoai" },
  ];
  return (
    <div className="flex h-screen gap-3">
      <div className="bg-white shadow-md rounded-lg p-4 w-full border border-gray-500 mt-4">
        <RoomTable
          headers={headers}
          displayedRooms={data}
          roomsPerPage={10}
          title={"Tất cả user khách hàng"}
          handleNavigate={navigate}
        />
      </div>
    </div>
  );
}

export default UserAdmin;
