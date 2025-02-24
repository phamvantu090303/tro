import Footer from "./footer";
import Header from "./header";

function Layout({ children }) {
  return (
    <div className="relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
