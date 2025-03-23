import React from "react";
import { motion } from "framer-motion";

function myroom() {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Image */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/500x200?text=Phòng+Trọ+Đẹp" // Thay bằng link ảnh thực tế
            alt="Phòng trọ"
            className="w-full h-48 object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white text-center">
              Phòng Trọ Của Bạn
            </h1>
          </motion.div>
        </div>

        {/* Thông tin phòng */}
        <div className="p-6 space-y-4">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Vị trí:</span> Gần
              trung tâm TP.HCM, cách chợ Bến Thành 10 phút.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Giá thuê:</span> 3.5
              triệu/tháng (cọc 1 tháng).
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Diện tích:</span>{" "}
              25m², thoáng mát, có cửa sổ lớn.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Tiện ích:</span>{" "}
              Điều hòa, wifi tốc độ cao, nhà vệ sinh riêng, bếp nhỏ.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Đặc biệt:</span> Khu
              vực an ninh, gần trường học và siêu thị.
            </p>
          </motion.div>
        </div>

        {/* Nút liên hệ */}
        <motion.div
          className="p-6 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
            Liên hệ: 0909 123 456
          </button>
        </motion.div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          Cảm ơn bạn đã chọn phòng trọ của chúng tôi!
        </div>
      </motion.div>
    </div>
  );
}

export default myroom;
