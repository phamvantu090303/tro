import { useEffect, useState } from "react";
import { axiosInstance } from "../../../Axios";
import { useSelector } from "react-redux";
import CardFavourite from "../../component/Favourite/CardFavourite";
import { useNavigate } from "react-router";

function Favourite() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const fetchDataFavourite = async () => {
        const res = await axiosInstance.get(`/yeu-thich/getdata/${user.id}`);
        setData(res.data.data);
      };
      fetchDataFavourite();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[100px] lg:px-[150px] mt-10 mb-20">
        <h1 className="text-3xl font-bold">Yêu thích</h1>
        <div className="space-y-5">
          {data.length > 0 ? (
            data.map((item, index) => (
              <CardFavourite
                key={index}
                price={item.gia_tien}
                title={item.ten_phong_tro}
                img={item.anh_phong}
                noidung={item.mo_ta}
                number={item.so_luong_nguoi}
                dientich={item.dien_tich}
                diachi={item.dia_chi}
                trangthai={item.trang_thai}
                thanhpho={item.ward}
              />
            ))
          ) : (
            <div className="h-[500px] flex items-center flex-col mt-40">
              <p className="text-black text-3xl font-medium text-center ">
                Bạn chưa có yêu thích phòng trọ nào , hãy trở về trang chủ để
                lựa phòng yêu thích nhé
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-customBg py-3 px-5 mt-4 text-white rounded-lg text-lg font-medium"
              >
                Trở về trang chủ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favourite;
