import { useSelector } from "react-redux";
import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../Axios";
import Category from "../../component/Categories/Categories";
import wallperdata from "../../assets/wallperhome/wallperpc.jpg";

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [dataTop, setDataTop] = useState([]);
  const [listdata, setListdata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/phongTro/get");
      setDataTop(res.data.data);
      const sortedBooks = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setListdata(sortedBooks);
    };

    fetchData();
  }, []);
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
            data={dataTop}
            limit={5}
            slide={true}
          />

          {/* Danh mục */}
          <Category />

          <div className="w-full relative lg:flex lg:flex-col lg:items-center lg:justify-center text-white  hidden">
            <img
              src={wallperdata}
              className="w-full h-auto max-h-[400px] md:max-h-[700px] object-cover blur-[px]"
            />
            <div className="absolute inset-0 bg-gradient-custom bg-opacity-40 h-full"></div>
            <div className="absolute inset-0 flex flex-col w-[100%]">
              <div>
                <div className="absolute top-[30%] right-10 w-[50%]">
                  <h1 className="text-[64px] text-right font-bold">An toàn</h1>
                  <p className="mt-2 text-lg  text-right">
                    Đảm bảo an toàn , đã được nhà nước chứng nhận
                  </p>
                  <span className=" block h-[2px] bg-white w-[70%] "></span>
                </div>
                <div className="absolute bottom-5 right-10 text-sm text-gray-300 text-end">
                  <p className="font-semibold text-[34px] mb-5">
                    calm & relaxed
                  </p>
                  <p>Contact: +62 891 7323 8801</p>
                </div>
              </div>
            </div>
          </div>
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
