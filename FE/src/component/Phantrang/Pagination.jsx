const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 border rounded-full px-2 py-1 mt-4">
      <button
        className={`px-3 py-1 rounded-full ${
          currentPage === 1 ? "text-black cursor-not-allowed" : "text-gray-600"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "bg-red-500 text-white font-bold"
            : "border text-brown-600"
        }`}
      >
        {currentPage} / {totalPages}
      </span>
      <button
        className={`px-3 py-1 rounded-full ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-brown-600"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
