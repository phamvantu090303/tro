import AccountAdmin from "../../pages/admin/home/AccountAdmin";
import PhongTroAdmin from "../../pages/admin/home/PhongTroAdmin";
import DanhMucAdmin from "../../pages/admin/home/DanhMucAdmin";
import ThietBiAdmin from "../../pages/admin/home/ThietBiAdmin";
import AnhPhongAdmin from "../../pages/admin/home/AnhPhongAdmin";
import YeuThichAdmin from "../../pages/admin/home/YeuThichAdmin";
import UserAdmin from "../../pages/admin/home/UserAdmin/UserAdmin";
import MessAdmin from "../../component/Mess/messAdmin";
import MapAdmin from "../../pages/admin/home/Map";
import ChartAdmin from "../../pages/admin/home/Chart/thongKeDienNang";
import ThongKeYeuThich from "../../pages/admin/home/Chart/thongKeYeuThich";
import ThongKeDanhGia from "../../pages/admin/home/Chart/thongKeDanhGia";
import QuyenManagement from "../../pages/admin/home/Quyen";
import DichvuAdmin from "../../pages/admin/home/dichvuAdmin";
function AdminDashboard({ activeComponent }) {
  const renderComponent = () => {
    switch (activeComponent) {
      case "quyen":
        return <QuyenManagement />;
      case "admin":
        return <AccountAdmin />;
      case "phongtro":
        return <PhongTroAdmin />;
      case "danhmuc":
        return <DanhMucAdmin />;
      case "dichvu":
        return <DichvuAdmin />;
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
      case "thongkeYeuthich":
        return <ThongKeYeuThich />;
      case "thongkeDien":
        return <ChartAdmin />;
      case "thongkeDanhgia":
        return <ThongKeDanhGia />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AdminDashboard;
