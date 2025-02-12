import { useSelector } from "react-redux";
import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../Axios";
import Category from "../../component/Categories";
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
      <img src={wallhome} alt="" className="w-full max-h-[500px]" />
      <div className="max-w-[1920px] mx-auto px-[150px] mt-[78px] mb-32">
        <div>
          <ProductShowcase desc={"Top Rated"} data={dataTop} limit={5} />
          <Category />
          <div className="mt-[40px]">
            <ProductShowcase desc={"Room List"} data={listdata} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
