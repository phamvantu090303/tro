import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import { useSelector } from "react-redux";
import { PhongTroProvider } from "../../Context/PhongTroContext";

function Admin() {
  const [activeComponent, setActiveComponent] = useState("admin");
  const { admin } = useSelector((state) => state.authAdmin);
  return (
    <PhongTroProvider isAdmin={true}>
      <div className="flex gap-3 border-r-2 border-[#000000]">
        <AdminSidebar
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
        <div className="flex-1">
          <AdminDashboard activeComponent={activeComponent} />
        </div>
      </div>
    </PhongTroProvider>
  );
}

export default Admin;
