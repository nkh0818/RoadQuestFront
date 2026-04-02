import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare } from "lucide-react";
import useReviewStore from "../store/useReviewStore"; 
import ReviewCard from "../components/review/ReviewCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ReviewListView() {
  const navigate = useNavigate();

  // Zustand에서 상태와 함수 가져오기
  const { reviews, isLoading, fetchReviews, deleteReview } = useReviewStore();

  // 페이지 진입 시 데이터 호출
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 삭제 핸들러
  const handleDelete = (id) => {
    if (window.confirm("정말 이 추억을 삭제하시겠습니까?")) {
      deleteReview(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F7]/30 pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
          <MessageSquare className="text-[#FF8AAE]" /> 리뷰 목록
        </h1>
        <span className="text-[12px] font-bold text-gray-400">
          총 {reviews.length}개
        </span>
      </header>

      {/* 리스트 영역 */}
      <main className="p-6 max-w-md mx-auto space-y-6">
        {isLoading ? (
          <LoadingSpinner 
            message="리뷰를 불러오고 있어요..." 
            subMessage="Fetching Reviews" 
          />
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={(id) => navigate(`/edit/${id}`)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold">
            아직 작성된 리뷰가 없어요.
          </div>
        )}
      </main>

      {/* 글쓰기 버튼 */}
      <button
        onClick={() => navigate("/write")}
        className="fixed bottom-8 right-6 w-14 h-14 bg-[#FF8AAE] text-white rounded-full shadow-lg shadow-[#FF8AAE]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={28} strokeWidth={3} />
      </button>
    </div>
  );
}