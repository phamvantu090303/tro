import { PhongTroProvider } from "../Context/PhongTroContext";
import Footer from "./footer";
import Header from "./header";
import ScrollToTop from "./ScrollToTop";

function Layout({ children }) {
  return (
    <PhongTroProvider isAdmin={false}>
      <ScrollToTop />
      <div className="relative">
        <Header />
        {children}
        <Footer />
      </div>
    </PhongTroProvider>
  );
}

export default Layout;
