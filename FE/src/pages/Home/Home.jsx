import { useSelector } from "react-redux";
import wallhome from "../../assets/roomwallperhome.jpg";
import ProductShowcase from "../../component/ProductShowcase";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../Axios";
function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/phongTro/get");
      console.log(res.data.data);
      setData(res.data.data);
    };
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <img src={wallhome} alt="" className="w-full max-h-[500px]" />

      <div className="max-w-[1920px] mx-auto px-[150px]">
        <div>
          <ProductShowcase desc={"Top Rated"} data={data} limit={5} />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
