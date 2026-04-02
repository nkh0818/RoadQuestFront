import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SubHeader from "../components/common/SubHeader";
import FadeIn from "../components/common/FadeIn";
import MyReviewItem from "../components/review/MyReviewItem";
import useReviewStore from "../store/useReviewStore";

export default function MyReviewListView() {
  const navigate = useNavigate();
  const { reviews, isLoading, fetchReviews, deleteReview } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteReview = (id) => {
    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      deleteReview(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <SubHeader
        title={
          <div className="py-2">
            <h2 className="text-[18px] font-black text-gray-900 tracking-tighter">
              나의 여행 기록
            </h2>
            <p className="mt-2 text-[10px] font-bold text-slate-400">
              총 {reviews.length}개의 소중한 추억
            </p>
          </div>
        }
      />
      <main className="mx-auto">
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner color="#3182CE" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {reviews.map((review, index) => (
              <MyReviewItem
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState navigate={navigate} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <FadeIn>
      <div className="py-32 flex flex-col items-center text-center px-10">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-50 mb-8 rotate-3">
          <MessageSquare size={48} className="text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-slate-900 font-black text-xl mb-2">
          기록이 텅 비어있어요
        </h3>
        <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
          휴게소에서의 즐거운 기억을
          <br />첫 번째 리뷰로 남겨보시는 건 어떨까요?
        </p>
        <button
          onClick={() => navigate("/search")}
          className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[14px] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          리뷰 작성하러 가기
        </button>
      </div>
    </FadeIn>
  );
}