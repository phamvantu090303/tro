import AccountAdmin from "../../Admin/home/AccountAdmin";
import PhongTroAdmin from "../../Admin/home/PhongTroAdmin";
import DanhMucAdmin from "../../Admin/home/DanhMucAdmin";
import ThietBiAdmin from "../../Admin/home/ThietBiAdmin";
import AnhPhongAdmin from "../../Admin/home/AnhPhongAdmin";
import YeuThichAdmin from "../../Admin/home/YeuThichAdmin";
import UserAdmin from "../../Admin/home/UserAdmin";

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
    }
  };

  return (
    <div className="">
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AdminDashboard;
