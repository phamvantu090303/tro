import { useEffect, useState } from "react";

import UserAdminDetail from "./UserAdminDetail";
import SearchBar from "../../../../../component/admin/SearchBar";
import { axiosInstance } from "../../../../../../Axios";
import RoomTable from "../../../../../component/admin/RoomTable";

function UserAdmin() {
  const [data, setData] = useState([]);
  const [step, setStep] = useState({
    page: 1,
    id: "",
  });
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
    <div>
      <SearchBar />
      {step.page === 1 && (
        <RoomTable
          headers={headers}
          displayedRooms={data}
          roomsPerPage={10}
          title={"Tất cả user khách hàng"}
          setStep={setStep}
        />
      )}
      {step.page === 2 && <UserAdminDetail id={step.id} setStep={setStep} />}
    </div>
  );
}

export default UserAdmin;
