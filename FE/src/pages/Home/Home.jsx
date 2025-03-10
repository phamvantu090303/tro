import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import Category from "../../component/Categories/Categories";
import { usePhongTro } from "../../Context/PhongTroContext";
import emailhome from "../../assets/phongtroemail.jpg";
import buiding from "../../assets/bulding.png";
import { FaRegUserCircle } from "react-icons/fa";

import { axiosInstance } from "../../../Axios";
import Slider from "react-slick";
function Homepage() {
  const settings = {
    dots: false,
    infinite: 1,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 1000,
    rtl: true,
    responsive: [
      {
        breakpoint: 1600, // Laptop màn lớn
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1280, // Laptop phổ thông
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // Laptop nhỏ hơn (13 inch)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Tablet & Mobile
        settings: {
          slidesToShow: 1,
          vertical: true,
          verticalSwiping: true,
        },
      },
    ],
  };

  const [listdata, setListdata] = useState([]);
  const { phongTro } = usePhongTro();
  const [topReview, setTopReview] = useState([]);
  useEffect(() => {
    if (phongTro.length > 0) {
      const sortedBooks = [...phongTro].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setListdata(sortedBooks);
    }
    const fetchTopReview = async () => {
      const res = await axiosInstance.get("/danh_gia/AllTopdanhgia");
      const filterTopReview = res.data.data.map((item) => ({
        ...item,
        noi_dung:
          item.noi_dung.length > 200
            ? item.noi_dung.slice(0, 200) + "..."
            : item.noi_dung,
      }));

      setTopReview(filterTopReview);
    };
    fetchTopReview();
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
            desc={"Phòng trọ được yêu thích"}
            data={phongTro}
            limit={10}
            slide={true}
          />

          {/* Danh mục */}
          <Category />
          <section className="w-full flex justify-center gap-20 bg-white py-20 items-center">
            <img
              src={emailhome}
              alt=""
              className="w-1/3 h-[570px] rounded-lg"
            />
            <div className="w-1/2">
              <h3 className="text-4xl font-medium w-2/3 ">
                Chúng tôi là đơn vị dẫn đầu trong lĩnh vực quản lý phòng trọ
              </h3>
              <p className="text-lg text-gray-900 mt-10">
                Công ty chúng tôi chuyên đổi mới ngành phòng trọ cao cấp, mang
                đến những trải nghiệm hoàn toàn mới thông qua mạng lưới các đại
                lý xuất sắc trên toàn cầu. Với mạng lưới phòng trọ rao cho thuê
                trên toàn thế giới. Trang web của chúng tôi cho phép bạn tìm
                kiếm danh sách phòng trọ trên toàn cầu và bao gồm danh mục lớn
                các phòng trọ sang trọng đang cho thuê, bao gồm phòng đơn, phòng
                đôi, căn hộ mini, nhà trọ, v.v.
              </p>
              <div className="grid grid-cols-4 mt-10">
                <div>
                  <p className="text-4xl font-medium text-customBlue">12+</p>
                  <p className="text-lg mt-2">
                    Số năm
                    <br /> kinh nghiệm
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-medium text-customBlue">
                    15.000+
                  </p>
                  <p className="text-lg mt-2">
                    Phòng trọ <br /> đang cho thuê
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-medium text-customBlue">
                    1 triệu+
                  </p>
                  <p className="text-lg mt-2">
                    Người mua và <br /> người bán hài lòng
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-medium text-customBlue">10+</p>
                  <p className="text-lg mt-2">
                    Giải thưởng <br /> đã đạt được
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Danh sách phòng */}
          <section className="mt-10">
            <ProductShowcase
              desc={"Tất cả phòng trọ"}
              data={listdata}
              limit={10}
              slide={false}
            />
          </section>

          {/**Top danh gia review */}
          <section className="mt-10 mb-10">
            <h3 className="text-[#23274A] font-bold text-2xl">Đánh giá</h3>
            <Slider {...settings} className="mt-10">
              {topReview.slice(0, 3).map((item, index) => (
                <div key={index}>
                  <div className="w-full md:max-w-[300px]  shadow-xl  p-4 rounded-lg cursor-pointer ">
                    <div className="flex items-center gap-3">
                      <FaRegUserCircle size={28} />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.user_info.username}
                        </h3>
                      </div>
                    </div>
                    <span className="text-yellow-500 text-lg">★★★★★</span>
                    <img
                      src={item.phong_info.anh_phong}
                      alt=""
                      className="mt-4 w-[400px] h-[200px] object-cover"
                    />
                    <p className="text-gray-700 text-sm mt-4">
                      {item.noi_dung}...
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
          <section className="relative w-full mx-auto bg-[#23284C] text-white rounded-lg p-10 flex items-center justify-between mt-10">
            <div className="max-w-lg">
              <h2 className="text-4xl font-semibold">
                Nhận tin tức mới nhất và ưu đãi đặc biệt dành cho bạn
              </h2>
              <div className="flex items-center bg-white rounded-xl px-5 py-4 shadow-md mt-20">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="text-gray-700 outline-none flex-1 px-3 py-2 bg-transparent text-xl"
                />
                <button className="bg-[#23284C] text-white px-6 py-4 rounded-lg font-medium hover:bg-[#2e3463]">
                  Subscribe
                </button>
              </div>
            </div>

            <img
              src={buiding}
              alt="Building"
              className="absolute -right-20 bottom-0 w-1/2 h-full"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
