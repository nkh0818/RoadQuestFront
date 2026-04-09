import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  MoreHorizontal,
  Edit2,
  Trash2,
  MapPin,
  ChevronUp,
} from "lucide-react";
import FadeIn from "../common/FadeIn";

export default function MyReviewItem({ review, onDelete, index }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const rId = review.reviewId;

  const handleRestAreaClick = () => {
    if (review.restAreaCode) {
      navigate(`/detail/${review.restAreaCode}`);
    }
  };

  const displayDate = review.createdAt
    ? review.createdAt.split("T")[0].replace(/-/g, ".")
    : "방문일 정보 없음";

  return (
    <FadeIn delay={index * 100}>
      <article className="bg-white p-6 pt-8 pb-10">
        {/* 상단: 장소 정보 및 관리 메뉴 */}
        <div className="flex justify-between items-start mb-4">
          {/* 왼쪽: 장소 정보 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#3182CE]">
              <MessageSquare
                size={20}
                fill="currentColor"
                fillOpacity={0.2}
                strokeWidth={2.5}
              />
            </div>
            <div onClick={handleRestAreaClick} className="cursor-pointer group">
              <h4 className="font-black text-slate-900 text-[17px] tracking-tight leading-tight">
                {review.restAreaName}
              </h4>
              <span className="text-[12px] text-slate-400 font-medium">
                {displayDate}
              </span>
            </div>
          </div>

          {/* 오른쪽: 내 리뷰 관리 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-all ${
                showMenu
                  ? "bg-slate-100 text-slate-600"
                  : "text-slate-300 hover:text-slate-600"
              }`}
            >
              <MoreHorizontal size={22} strokeWidth={2.5} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />

                {/* 메뉴 본체 */}
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-1.5 z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigate(`/review/edit/${rId}`, {
                          state: { review },
                        });
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <Edit2 size={16} className="text-blue-500" />
                      <span>수정하기</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(rId);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <Trash2 size={16} />
                      <span>삭제하기</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 이미지 영역 */}
        {review.imageUrl && (
          <div className="relative w-full aspect-16/10 rounded-[1.8rem] overflow-hidden mb-6 shadow-xl shadow-slate-900/5">
            <img
              src={review.imageUrl}
              alt={review.restAreaName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] font-black text-slate-900 shadow-xl flex items-center gap-1.5 active:scale-95 transition-all">
              <MapPin
                size={14}
                className="text-[#3182CE]"
                fill="#3182CE"
                fillOpacity={0.15}
                strokeWidth={2.5}
              />
              장소 인증
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < review.rating ? "text-amber-400" : "text-slate-200"}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-slate-700 text-[15px] leading-relaxed font-medium">
            {review.content}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {review.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-black text-[#3182CE] bg-blue-50 px-3 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
