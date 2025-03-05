import { useState, useEffect } from "react";
import { axiosInstance } from "../../../Axios";
import { FaUser, FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function RoomReview({ id }) {
  const { user } = useSelector((state) => state.auth);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/danh_gia/getdanhgia/${id}`);

      // Định dạng ngày tháng trước khi set vào state
      const formattedReviews = response.data.data.map((review) => ({
        ...review,
        createdAt: formatDate(review.createdAt), // Định dạng lại trường createdAt
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  // Gửi đánh giá mới
  const handleSubmit = async () => {
    if (!review.trim()) return alert("Vui lòng nhập nội dung đánh giá!");

    try {
      await axiosInstance.post("/danh_gia/createdanhgia", {
        ma_phong: id,
        noi_dung: review,
      });

      setReview(""); // Xóa nội dung sau khi gửi
      fetchReviews(); // Cập nhật danh sách đánh giá
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };

  return (
    <div className="w-full mx-auto bg-gray-100 rounded-xl shadow-md">
      <div className="w-full mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              fetchReviews={fetchReviews}
            />
          ))
        ) : (
          <p className="text-gray-600">Chưa có đánh giá nào.</p>
        )}
        <div className="h-[1px] w-full bg-gray-800 mt-4"></div>
        {user ? (
          <div className=" flex gap-3 mt-10">
            <div className="w-full relative">
              <textarea
                className="w-full p-3  border rounded-md outline-none text-black bg-gray-100 placeholder-gray-500 focus:outline-slate-700 "
                rows="5"
                placeholder="Nhập nhận xét của bạn..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>

              <button
                className="absolute bottom-5 right-4  flex bg-[#23284C] text-white py-3 px-5 font-medium mt-5 rounded-full hover:bg-blue-700 transition-all ml-auto"
                onClick={handleSubmit}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Vui lòng đăng nhập để sử dụng đánh giá</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component hiển thị một đánh giá và xử lý trả lời + thu hồi
function ReviewItem({ review, fetchReviews }) {
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Gửi trả lời bình luận
  const handleReply = async () => {
    if (!reply.trim()) return alert("Vui lòng nhập nội dung trả lời!");

    try {
      await axiosInstance.post("/danh_gia/createdanhgia", {
        ma_phong: review.ma_phong,
        noi_dung: reply,
        repcomment: review._id, // Gán ID bình luận cha
      });

      setReply("");
      setIsReplying(false);
      fetchReviews();
    } catch (error) {
      console.error("Lỗi khi gửi trả lời:", error);
    }
  };

  // Xóa bình luận
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    try {
      await axiosInstance.post(`/danh_gia/deletedanhgia/${review._id}`);
      fetchReviews();
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };
  console.log("review", review);
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <div className="">
        <div className="flex gap-3">
          <FaUser size={30} className="border border-gray-500 rounded-full" />
          <div>
            <p className="font-medium text-lg">{review.user.username}</p>
            <p className="text-black text-lg mt-3">{review.noi_dung}</p>
            <div className="flex gap-4 mt-2">
              <button
                className="text-gray-600 hover:underline flex items-center gap-1"
                onClick={() => setIsReplying(!isReplying)}
              >
                {isReplying ? (
                  "Hủy"
                ) : (
                  <>
                    {" "}
                    <FaComment />
                    Trả lời
                  </>
                )}
              </button>

              <button
                className="text-red-600 hover:underline"
                onClick={handleDelete}
              >
                Thu hồi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút trả lời & thu hồi */}

      {/* Form nhập trả lời */}
      {isReplying && (
        <div className="mt-2 ml-6">
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Nhập câu trả lời..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          ></textarea>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleReply}
          >
            Gửi trả lời
          </button>
        </div>
      )}

      {/* Nếu có phản hồi con, hiển thị chúng theo dạng cây */}
      {review.replies.length > 0 && (
        <div className="mt-3 ml-6 border-l-2 border-gray-300 pl-4">
          {review.replies.map((reply) => (
            <ReviewItem
              key={reply._id}
              review={reply}
              fetchReviews={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
