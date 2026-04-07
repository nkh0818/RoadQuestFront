import React, { useState, useRef } from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function BestReviewRanking({ data }) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef(null);

  // 🚩 마우스 드래그를 위한 상태값들
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  if (!data || data.length === 0) return null;
  const displayData = data.slice(0, 5);

  // 1. 인덱스 계산 (스크롤 멈췄을 때)
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const index = Math.round(scrollLeft / (280 + 16));
      if (index !== scrollIndex) setScrollIndex(index);
    }
  };

  // 2. 🚩 마우스 드래그 시작
  const onDragStart = (e) => {
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  // 3. 🚩 마우스 드래그 중
  const onDragMove = (e) => {
    if (!isDrag) return;
    e.preventDefault(); // 드래그 시 텍스트 선택 방지
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };

  // 4. 🚩 드래그 종료
  const onDragEnd = () => {
    setIsDrag(false);
  };

  return (
    <section className="py-16 bg-slate-50/50 overflow-hidden">
      {" "}
      {/* 🚩 배경에 미세한 색감 추가 */}
      <div className="px-8 mb-10 flex justify-between items-end max-w-6xl mx-auto">
        <div className="text-left">
          <p className="text-blue-600 font-black text-[12px] tracking-[0.2em] mb-2 uppercase">
            Real-time Feedback
          </p>
          <h2 className="text-[28px] font-black text-slate-950 tracking-tighter leading-tight">
            지금{" "}
            <span className="text-blue-600 underline underline-offset-8 decoration-blue-100">
              실시간
            </span>{" "}
            리뷰
          </h2>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        className={`flex gap-6 overflow-x-auto px-8 pb-12 snap-x snap-mandatory scrollbar-hide shrink-0 transition-all ${
          isDrag ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollBehavior: isDrag ? "auto" : "smooth",
          userSelect: "none",
        }}
      >
        {displayData.map((review, index) => (
          <div
            key={index}
            className="min-w-[300px] max-w-[300px] snap-center shrink-0"
          >
            <div className="h-full bg-white rounded-[3rem] p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-500 pointer-events-none">
              <div>
                <div className="flex items-center gap-1.5 mb-6 px-3 py-1.5 bg-blue-50/50 rounded-xl w-fit border border-blue-100/30">
                  <MessageSquare
                    size={14}
                    className="text-blue-600 fill-blue-600/20"
                  />
                  <span className="text-[11px] font-black tracking-widest text-blue-700 uppercase">
                    Review
                  </span>
                </div>
                <p className="text-[18px] text-slate-700 leading-[1.8] line-clamp-5 break-keep tracking-tight">
                  "{review.content}"
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">

                <div className="flex flex-col max-w-[60%]">
                  <span className="text-[14px] font-black text-slate-950 truncate">
                    {review.restAreaName || "전국 휴게소"}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-slate-600">
                    @{review.nickname}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="min-w-[40px] shrink-0" />
      </div>
      <div className="flex justify-center gap-2 items-center">
        {displayData.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === scrollIndex ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
