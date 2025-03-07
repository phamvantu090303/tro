import { useState } from "react";
import AdminSidebar from "../../admin/home/AdminSidebar";
import AdminDashboard from "../../admin/home/AdminDashboard";
import { useSelector } from "react-redux";
import { PhongTroProvider } from "../../../Context/PhongTroContext";

function Admin() {
  const [activeComponent, setActiveComponent] = useState("account");
  const { admin } = useSelector((state) => state.authAdmin);
  return (
    <PhongTroProvider isAdmin={true}>
      <div className="flex gap-3 border-r-2 border-[#000000]">
        <AdminSidebar setActiveComponent={setActiveComponent} />
        <div className="flex-1 h-screen">
          <AdminDashboard activeComponent={activeComponent} />
        </div>
      </div>
    </PhongTroProvider>
  );
}

export default Admin;
