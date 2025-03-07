import { createContext, useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../Axios";

const PhongTroContext = createContext();

export const PhongTroProvider = ({ children, isAdmin = false }) => {
  const [phongTro, setPhongTro] = useState([]);

  useEffect(() => {
    const fetchPhongTro = async () => {
      try {
        const { data } = await axiosInstance.get("/phongTro/get");
        setPhongTro(
          isAdmin ? data.data : data.data.filter((dm) => dm.trang_thai === 1)
        );
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchPhongTro();
  }, [isAdmin]);

  return (
    <PhongTroContext.Provider value={{ phongTro, setPhongTro }}>
      {children}
    </PhongTroContext.Provider>
  );
};

// Hook dùng để lấy dữ liệu từ Context
export const usePhongTro = () => {
  const context = useContext(PhongTroContext);
  if (!context) {
    throw new Error("useDanhMuc phải được sử dụng trong DanhMucProvider");
  }
  return context;
};
