import { PhongTroProvider } from "../Context/PhongTroContext";
import Footer from "./footer";
import Header from "./header";

function Layout({ children }) {
  return (
    <PhongTroProvider isAdmin={false}>
      <div className="relative">
        <Header />
        {children}
        <Footer />
      </div>
    </PhongTroProvider>
  );
}

export default Layout;
