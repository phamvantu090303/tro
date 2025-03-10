import { useEffect, useState } from "react";

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi dữ liệu thay đổi
  }, [items]);

  // Cắt danh sách item theo trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { currentPage, totalPages, currentItems, handlePageChange };
};

export default usePagination;
