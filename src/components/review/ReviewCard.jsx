import React from "react";
import { Star, Edit2, Trash2, MapPin, Calendar, ChevronRight } from "lucide-react";

export default function ReviewCard({ review, onEdit, onDelete, isMine = false }) {
  // 운전 중 눈이 편안한 블루 포인트 컬러
  const pointColor = "#3182CE";

  return (
    <div className="bg-white mt-5 overflow-hidden border-b border-gray-300 flex flex-col group transition-all hover:shadow-xl hover:shadow-blue-950/5 active:scale-[0.99]">
      
      {/* 1. 이미지 영역 (사진이 있을 때만 노출) */}
      {review.thumbnail ? (
        <div className="w-full aspect-video overflow-hidden relative bg-slate-100">
          <img
            src={review.thumbnail}
            alt={review.placeName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* 방문 인증 배지 */}
          {review.lat && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
              <MapPin size={12} fill={pointColor} className="text-[#3182CE]" />
              <span className="text-[11px] font-bold text-slate-800 tracking-tight">방문 인증 완료</span>
            </div>
          )}
        </div>
      ) : (
        /* 사진 없을 때의 깔끔한 상단 바 */
        <div className="w-full h-2 bg-slate-50" />
      )}

      {/* 2. 콘텐츠 영역 */}
      <div className="p-7 space-y-4">
        {/* 헤더: 장소명, 날짜, 관리버튼 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="font-black text-[20px] text-slate-900 tracking-tight truncate">
                {review.placeName}
              </h4>
              <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
            </div>

            {/* 작성자 + 칭호 */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] font-bold text-slate-700">
                {review.nickname}
              </span>

                {review.currentTitle && (
                  <span className="text-[11px] font-extrabold text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg">
                    {typeof review.currentTitle === "string"
                    ? review.currentTitle
                    : review.currentTitle.titleName}
                  </span>
                )}
</div>
            
            <div className="flex items-center gap-3">
              {/* 별점 */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? pointColor : "none"}
                    stroke={i < review.rating ? pointColor : "#D1D5DB"}
                    strokeWidth={i < review.rating ? 0 : 2}
                  />
                ))}
              </div>
              {/* 날짜 */}
              <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1">
                <Calendar size={12} strokeWidth={2.5} /> {review.date}
              </span>
            </div>
          </div>
          
          {/* 내 글일 때만 노출되는 액션 버튼 */}
          {isMine && (
            <div className="flex gap-1 bg-slate-50 rounded-2xl p-1 ml-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(review.id); }}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(review.id); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 리뷰 본문 */}
        <p className="text-slate-600 text-[15px] leading-[1.6] font-medium break-all">
          {review.content}
        </p>

        {/* 태그 및 메타 정보 */}
        {(review.tags?.length > 0 || review.lat) && (
          <div className="pt-2 flex flex-wrap gap-2 items-center">
            {review.tags?.map((tag, i) => (
              <span key={i} className="text-[12px] font-extrabold text-[#3182CE] bg-blue-50 px-3 py-1 rounded-xl">
                #{tag}
              </span>
            ))}
            
            {/* 사진이 없을 때 아래쪽에 인증 표시 */}
            {!review.thumbnail && review.lat && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold ml-1">
                <MapPin size={12} /> 인증된 방문
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}