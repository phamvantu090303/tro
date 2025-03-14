import AccountAdmin from "../../pages/admin/home/AccountAdmin";
import PhongTroAdmin from "../../pages/admin/home/PhongTroAdmin";
import DanhMucAdmin from "../../pages/admin/home/DanhMucAdmin";
import ThietBiAdmin from "../../pages/admin/home/ThietBiAdmin";
import AnhPhongAdmin from "../../pages/admin/home/AnhPhongAdmin";
import YeuThichAdmin from "../../pages/admin/home/YeuThichAdmin";
import UserAdmin from "../../pages/admin/home/UserAdmin/UserAdmin";
import MessAdmin from "../../component/Mess/messAdmin";
import MapAdmin from "../../pages/admin/home/Map";
import ThongKe from "../../pages/Chart/ThongKeAll";

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
      case "thongke":
        return <ThongKe />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AdminDashboard;
