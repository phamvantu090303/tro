import { useState, useEffect } from "react"; // Import useState
import { axiosInstance } from "../../Axios";
import CitySelector from "./CitySelector";

function Category() {
  const [dataCategories, setDataCategories] = useState([]);

  useEffect(() => {
    const fetchDanhMuc = async () => {
      try {
        const res = await axiosInstance.get("/danh-muc/");
        const filter = res.data.data.filter((item) => item.trang_thai === 1);
        setDataCategories(filter);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchDanhMuc();
  }, []);

  return (
    <div className="mt-[40px]">
      <div className=" items-end">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[#23274A] font-bold text-2xl ">Category</p>
            <CitySelector />
          </div>
          <div className="w-[117px] h-[4px] bg-[#FEBB02] mt-8"></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-4">
          {dataCategories &&
            dataCategories.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="relative w-[295px] h-[220px] rounded-xl cursor-pointer"
              >
                <img
                  src={item.Img}
                  alt={item.ten_danh_muc}
                  className="absolute inset-0 w-full h-full rounded-xl object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <p className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
                  {item.ten_danh_muc}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Category;
