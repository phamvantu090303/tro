import { useState } from "react";

import UserAdminDetail from "./UserAdminDetail";
import SearchBar from "../../../../../component/admin/SearchBar";
import RoomTable from "../../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../../hook/useApiManagerAdmin";

function UserAdmin() {
  const [step, setStep] = useState({
    page: 1,
    id: "",
  });

  const { data: user, DeleteData } = useApiManagerAdmin("/auth");

  const headers = [
    { label: "UserName", key: "username" },
    { label: "Họ và tên", key: "ho_va_ten" },
    { label: "Email", key: "email" },
    { label: "Ngày sinh", key: "ngay_sinh" },
    { label: "Quê quán", key: "que_quan" },
    { label: "Số điện thoại", key: "so_dien_thoai" },
  ];
  const handleDelete = async (value) => {
    await DeleteData(value._id);
  };
  return (
    <div>
      <SearchBar />
      {step.page === 1 && (
        <RoomTable
          headers={headers}
          displayedRooms={user}
          roomsPerPage={10}
          title={"Tất cả user khách hàng"}
          setStep={setStep}
          handleDelete={handleDelete}
        />
      )}
      {step.page === 2 && <UserAdminDetail id={step.id} setStep={setStep} />}
    </div>
  );
}

export default UserAdmin;
