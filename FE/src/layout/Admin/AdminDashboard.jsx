import AccountAdmin from "../../pages/admin/home/Quanly/AccountAdmin";
import PhongTroAdmin from "../../pages/admin/home/Quanly/PhongTroAdmin";
import DanhMucAdmin from "../../pages/admin/home/Quanly/DanhMucAdmin";
import ThietBiAdmin from "../../pages/admin/home/Quanly/ThietBiAdmin";
import AnhPhongAdmin from "../../pages/admin/home/Quanly/AnhPhongAdmin";
import YeuThichAdmin from "../../pages/admin/home/Quanly/YeuThichAdmin";
import UserAdmin from "../../pages/admin/home/Quanly/UserAdmin/UserAdmin";
import MessAdmin from "../../component/Mess/messAdmin";
import MapAdmin from "../../pages/admin/home/Quanly/Map";
import ChartAdmin from "../../pages/admin/home/Chart/thongKeDienNang";
import ThongKeYeuThich from "../../pages/admin/home/Chart/thongKeYeuThich";
import ThongKeDanhGia from "../../pages/admin/home/Chart/thongKeDanhGia";
import QuyenManagement from "../../pages/admin/home/Quanly/Quyen";
import DichvuAdmin from "../../pages/admin/home/Quanly/dichvuAdmin";
import SuachuaAdmin from "../../pages/admin/home/Quanly/SuachuaAdmin";
import HoadonThangAdmin from "../../pages/admin/home/Quanly/HoadonThang";
import HoadonCocAdmin from "../../pages/admin/home/Quanly/HoadonCocAdmin";
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
      case "hoadoncoc":
        return <HoadonCocAdmin />;
      case "hoadonthang":
        return <HoadonThangAdmin />;
      case "thietbi":
        return <ThietBiAdmin />;
      case "anhphong":
        return <AnhPhongAdmin />;
      case "yeuthich":
        return <YeuThichAdmin />;
      case "suachua":
        return <SuachuaAdmin />;
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
