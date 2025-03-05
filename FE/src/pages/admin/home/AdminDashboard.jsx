import AccountAdmin from "../../admin/home/AccountAdmin";
import PhongTroAdmin from "../../admin/home/PhongTroAdmin";
import DanhMucAdmin from "../../admin/home/DanhMucAdmin";
import ThietBiAdmin from "../../admin/home/ThietBiAdmin";
import AnhPhongAdmin from "../../admin/home/AnhPhongAdmin";
import YeuThichAdmin from "../../admin/home/YeuThichAdmin";
import UserAdmin from "../../admin/home/UserAdmin";
import MessAdmin from "../../../component/Mess/messAdmin";
import MapAdmin from "./Map";

function AdminDashboard({ activeComponent }) {
  const renderComponent = () => {
    switch (activeComponent) {
      case "admin":
        return <AccountAdmin />;
      case "phongtro":
        return <PhongTroAdmin />;
      case "danhmuc":
        return <DanhMucAdmin />;
      case "thietbi":
        return <ThietBiAdmin />;
      case "anhphong":
        return <AnhPhongAdmin />;
      case "yeuthich":
        return <YeuThichAdmin />;
      case "adminuser":
        return <UserAdmin />;
      case "mess":
        return <MessAdmin />;
      case "map":
        return <MapAdmin />;
    }
  };

  return (
    <div className="">
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AdminDashboard;
