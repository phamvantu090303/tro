import { Outlet } from "react-router";
import { PhongTroProvider } from "../../Context/PhongTroContext";
import Footer from "./footer";
import Header from "./header";
import ScrollToTop from "../../component/ScrollToTop";

function Layout() {
  return (
    <PhongTroProvider isAdmin={false}>
      <ScrollToTop />
      <div className="relative">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </PhongTroProvider>
  );
}

export default Layout;
