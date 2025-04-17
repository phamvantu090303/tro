import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import { PhongTroProvider } from "../../Context/PhongTroContext";

function Admin() {
  const [activeComponent, setActiveComponent] = useState("admin");
  return (
    <PhongTroProvider isAdmin={true}>
      <div className="flex h-screen">
        <AdminSidebar
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
        <div className="flex-1 overflow-y-auto ">
          <AdminDashboard activeComponent={activeComponent} />
        </div>
      </div>
    </PhongTroProvider>
  );
}

export default Admin;
