import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import Category from "../../component/Categories/Categories";
import { usePhongTro } from "../../Context/PhongTroContext";
function Homepage() {
  const [listdata, setListdata] = useState([]);
  const { phongTro } = usePhongTro();
  useEffect(() => {
    if (phongTro.length > 0) {
      const sortedBooks = [...phongTro].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setListdata(sortedBooks);
    }
  }, [phongTro]);

  return (
    <div className="w-full ">
      <img
        src={wallhome}
        alt=""
        className="w-full h-auto max-h-[400px] md:max-h-[500px] object-cover"
      />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[100px] lg:px-[150px] mt-10 mb-20">
        <div className="space-y-10">
          {/* Top Rated */}
          <ProductShowcase
            desc={"Top Rated"}
            data={phongTro}
            limit={10}
            slide={true}
          />

          {/* Danh mục */}
          <Category />

          {/* Danh sách phòng */}
          <div className="mt-10">
            <ProductShowcase
              desc={"Room List"}
              data={listdata}
              limit={10}
              slide={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
