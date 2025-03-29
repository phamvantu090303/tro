import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import Category from "../../component/Categories/Categories";
import { usePhongTro } from "../../Context/PhongTroContext";
import emailhome from "../../assets/phongtroemail.jpg";
import buiding from "../../assets/bulding.png";
import { FaRegUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { axiosInstance } from "../../../Axios";
import Slider from "react-slick";
import { useNavigate } from "react-router";

const slideUpVariants = {
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

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
  const navigate = useNavigate();
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
          item.noi_dung.length > 100
            ? item.noi_dung.slice(0, 100) + "..."
            : item.noi_dung,
      }));

      setTopReview(filterTopReview);
    };
    fetchTopReview();
  }, [phongTro]);
  return (
    <div className="w-full">
      {/* Ảnh bìa */}
      <img
        src={wallhome}
        alt=""
        className="w-full h-auto max-h-[400px] md:max-h-[500px] object-cover"
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[100px] lg:px-[150px] mt-10 mb-20">
        <div className="space-y-10">
          {/* Phòng trọ được yêu thích */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
          >
            <ProductShowcase
              desc="Phòng trọ được yêu thích"
              data={phongTro}
              limit={10}
              slide={true}
            />
          </motion.section>

          {/* Danh mục */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
          >
            <Category />
          </motion.section>

          {/* Giới thiệu */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
            className="w-full flex justify-center gap-20 bg-white py-20 items-center"
          >
            <img
              src={emailhome}
              alt=""
              className="w-1/3 h-[570px] rounded-lg"
            />
            <div className="w-1/2">
              <h3 className="text-4xl font-medium w-2/3">
                Chúng tôi là đơn vị dẫn đầu trong lĩnh vực quản lý phòng trọ
              </h3>
              <p className="text-lg text-gray-900 mt-10">
                Công ty chúng tôi chuyên đổi mới ngành phòng trọ cao cấp...
              </p>
              <div className="grid grid-cols-4 mt-10">
                {[
                  { num: "12+", text: "Số năm\nkinh nghiệm" },
                  { num: "15.000+", text: "Phòng trọ\nđang cho thuê" },
                  { num: "1 triệu+", text: "Người mua và\nngười bán hài lòng" },
                  { num: "10+", text: "Giải thưởng\nđã đạt được" },
                ].map((item, index) => (
                  <div key={index}>
                    <p className="text-4xl font-medium text-customBlue">
                      {item.num}
                    </p>
                    <p className="text-lg mt-2 whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Danh sách phòng */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
            className="mt-10"
          >
            <ProductShowcase
              desc="Tất cả phòng trọ"
              data={listdata}
              limit={10}
              slide={false}
            />
          </motion.section>

          {/* Đánh giá */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
            className="my-10"
          >
            <h3 className="text-[#23274A] font-bold text-2xl">Đánh giá</h3>
            <Slider {...settings} className="py-5 ">
              {topReview.map((item, index) => (
                <div
                  key={index}
                  className="w-full md:max-w-[300px] shadow-xl p-5 rounded-lg cursor-pointer h-[380px] my-10"
                  onClick={() =>
                    navigate(`/details/${item.phong_info.ma_phong}`)
                  }
                >
                  <div className="flex items-center gap-3">
                    <FaRegUserCircle size={28} />
                    <h3 className="text-lg font-semibold">
                      {item.user_info.username}
                    </h3>
                  </div>
                  <span className="text-yellow-500 text-lg">★★★★★</span>
                  <img
                    src={item.phong_info.anh_phong}
                    alt=""
                    className="mt-4 w-[400px] h-[200px] object-cover"
                  />
                  <p className="text-gray-700 text-sm mt-4">{item.noi_dung}</p>
                </div>
              ))}
            </Slider>
          </motion.section>

          {/* Đăng ký nhận tin tức */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUpVariants}
            className="relative w-full mx-auto bg-[#23284C] text-white rounded-lg p-10 flex items-center justify-between mt-10"
          >
            <div className="max-w-lg">
              <h2 className="text-4xl font-semibold">
                Nhận tin tức mới nhất và ưu đãi đặc biệt
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
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
