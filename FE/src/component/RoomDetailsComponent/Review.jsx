import { useState, useEffect } from "react";
import { axiosInstance } from "../../../Axios";

export default function RoomReview({ id }) {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  // Lấy danh sách đánh giá
  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/danh_gia/getdanhgia/${id}`);
      setReviews(response.data.data);
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-100 rounded-xl shadow-md">
      {/* Phần nhập đánh giá */}
      <div className="p-6">
        <img
          src="https://cdn.vjshop.vn/tin-tuc/huong-dan-chup-anh-stock-cho-nguoi-moi/chup-anh-stock-1.png"
          alt="Room"
          className="w-full h-60 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-semibold mt-4">Deluxe King Room</h2>
        <p className="text-gray-600 mt-2">Một phòng nghỉ tiện nghi với view thành phố đẹp.</p>
        <textarea
          className="w-full p-3 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Nhập nhận xét của bạn..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <button
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          onClick={handleSubmit}
        >
          Gửi đánh giá
        </button>
      </div>

      {/* Hiển thị danh sách đánh giá */}
      <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewItem key={review._id} review={review} fetchReviews={fetchReviews} />)
        ) : (
          <p className="text-gray-600">Chưa có đánh giá nào.</p>
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

  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <p className="font-medium">{review.user.username}</p>
      <p className="text-gray-600 mt-2">{review.noi_dung}</p>

      {/* Nút trả lời & thu hồi */}
      <div className="flex gap-4 mt-2">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsReplying(!isReplying)}
        >
          {isReplying ? "Hủy" : "Trả lời"}
        </button>
        <button className="text-red-600 hover:underline" onClick={handleDelete}>
          Thu hồi
        </button>
      </div>

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
            <ReviewItem key={reply._id} review={reply} fetchReviews={fetchReviews} />
          ))}
        </div>
      )}
    </div>
  );
}
